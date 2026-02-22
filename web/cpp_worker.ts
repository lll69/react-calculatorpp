import { initJscl, getMathEngine, isParseException, getErrorMessage, pePosition, peExpression, peMessageCode, peParams, evaluate, simplify, elementary, processExpr, setAngleUnits, setNumeralBase } from "./jscl";
import { RequestType, WorkerRequest, WorkerResult } from "./worker_types";
import { AngleUnit, NumeralBase, ParseException } from "./CalculatorJscl";

interface MathEngine {
    engine: any;
    evaluate(expr: string): string;
    simplify(expr: string): string;
    elementary(expr: string): string;
    processExpr(expr: string): string;
    setAngleUnits(unit: AngleUnit): void;
    setNumeralBase(unit: NumeralBase): void;
}

const postWorkerMessage: ((msg: WorkerResult) => void) = postMessage;

const wrapException = (from) => {
    if (isParseException(from)) {
        const result: ParseException = {
            position: pePosition(from),
            expression: peExpression(from),
            messageCode: peMessageCode(from),
            params: peParams(from),
        };
        return result;
    } else {
        return getErrorMessage(from);
    }
}

function getEngine(): MathEngine {
    const engine = getMathEngine();
    return {
        engine: engine,
        evaluate: (expr: string) => {
            try {
                return evaluate(engine, expr);
            } catch (e) {
                throw wrapException(e);
            }
        },
        simplify: (expr: string) => {
            try {
                return simplify(engine, expr);
            } catch (e) {
                throw wrapException(e);
            }
        },
        elementary: (expr: string) => {
            try {
                return elementary(engine, expr);
            } catch (e) {
                throw wrapException(e);
            }
        },
        processExpr: (expr: string) => {
            try {
                return processExpr(engine, expr);
            } catch (e) {
                throw wrapException(e);
            }
        },
        setAngleUnits: (unit: AngleUnit) => {
            setAngleUnits(engine, unit);
        },
        setNumeralBase: (base: NumeralBase) => {
            setNumeralBase(engine, base);
        },
    }
}

initJscl();
const mathEngine = getEngine();

onmessage = (event: MessageEvent) => {
    const request = event.data as WorkerRequest;
    switch (request.type) {
        case RequestType.EVALUATE_OR_SIMPLIFY: {
            mathEngine.setAngleUnits(request.angleUnit);
            mathEngine.setNumeralBase(request.numeralBase);
            let result: string | undefined;
            try {
                result = mathEngine.evaluate(mathEngine.processExpr(request.expr));
                postWorkerMessage({
                    type: RequestType.EVALUATE_OR_SIMPLIFY,
                    uid: request.uid,
                    success: true,
                    expr: request.expr,
                    result: result,
                    resultType: RequestType.EVALUATE,
                });
            } catch (evaluateError) {
                try {
                    result = mathEngine.simplify(mathEngine.processExpr(request.expr));
                    postWorkerMessage({
                        type: RequestType.EVALUATE_OR_SIMPLIFY,
                        uid: request.uid,
                        success: true,
                        expr: request.expr,
                        result: result,
                        resultType: RequestType.SIMPLIFY,
                        evaluateError: evaluateError,
                    });
                } catch (simplifyError) {
                    postWorkerMessage({
                        type: RequestType.EVALUATE_OR_SIMPLIFY,
                        uid: request.uid,
                        success: false,
                        expr: request.expr,
                        result: null,
                        resultType: RequestType.SIMPLIFY,
                        evaluateError: evaluateError,
                        simplifyError: simplifyError,
                    });
                }
            }
            break;
        }
        case RequestType.EVALUATE: {
            mathEngine.setAngleUnits(request.angleUnit);
            mathEngine.setNumeralBase(request.numeralBase);
            try {
                const result = mathEngine.evaluate(mathEngine.processExpr(request.expr));
                postWorkerMessage({
                    type: RequestType.EVALUATE,
                    uid: request.uid,
                    success: true,
                    expr: request.expr,
                    result: result,
                });
            } catch (evaluateError) {
                postWorkerMessage({
                    type: RequestType.EVALUATE,
                    uid: request.uid,
                    success: false,
                    expr: request.expr,
                    evaluateError: evaluateError,
                });
            }
            break;
        }
        case RequestType.SIMPLIFY: {
            mathEngine.setAngleUnits(request.angleUnit);
            mathEngine.setNumeralBase(request.numeralBase);
            try {
                const result = mathEngine.simplify(mathEngine.processExpr(request.expr));
                postWorkerMessage({
                    type: RequestType.SIMPLIFY,
                    uid: request.uid,
                    success: true,
                    expr: request.expr,
                    result: result,
                });
            } catch (simplifyError) {
                postWorkerMessage({
                    type: RequestType.SIMPLIFY,
                    uid: request.uid,
                    success: false,
                    expr: request.expr,
                    simplifyError: simplifyError,
                });
            }
            break;
        }
    }
};

postWorkerMessage({ type: "init" });

export { };
