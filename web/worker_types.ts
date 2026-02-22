import { AngleUnit, NumeralBase, ParseException } from "./CalculatorJscl"

export const enum RequestType {
    EVALUATE = "evaluate",
    SIMPLIFY = "simplify",
    EVALUATE_OR_SIMPLIFY = "evaluate/simplify",
}

export type InitResult = {
    type: "init",
}

export type EvaluateOrSimplifyRequest = {
    type: RequestType.EVALUATE_OR_SIMPLIFY,
    uid: number,
    expr: string,
    angleUnit: AngleUnit,
    numeralBase: NumeralBase,
}

export type EvaluateOrSimplifyResultEvaluateSuccess = {
    type: RequestType.EVALUATE_OR_SIMPLIFY,
    uid: number,
    success: true,
    expr: string,
    result: string,
    resultType: RequestType.EVALUATE,
}

export type EvaluateOrSimplifyResultSimplifySuccess = {
    type: RequestType.EVALUATE_OR_SIMPLIFY,
    uid: number,
    success: true,
    expr: string,
    result: string,
    resultType: RequestType.SIMPLIFY,
    evaluateError: ParseException | string,
}

export type EvaluateOrSimplifyResultSimplifyError = {
    type: RequestType.EVALUATE_OR_SIMPLIFY,
    uid: number,
    success: false,
    expr: string,
    result: null,
    resultType: RequestType.SIMPLIFY,
    evaluateError: ParseException | string,
    simplifyError: ParseException | string,
}

export type EvaluateOrSimplifyResult = EvaluateOrSimplifyResultEvaluateSuccess | EvaluateOrSimplifyResultSimplifySuccess | EvaluateOrSimplifyResultSimplifyError;

export type EvaluateRequest = {
    type: RequestType.EVALUATE,
    uid: number,
    expr: string,
    angleUnit: AngleUnit,
    numeralBase: NumeralBase,
}

export type EvaluateResultSuccess = {
    type: RequestType.EVALUATE,
    uid: number,
    success: true,
    expr: string,
    result: string,
}

export type EvaluateResultError = {
    type: RequestType.EVALUATE,
    uid: number,
    success: false,
    expr: string,
    evaluateError: ParseException | string,
}

export type EvaluateResult = EvaluateResultSuccess | EvaluateResultError;

export type SimplifyRequest = {
    type: RequestType.SIMPLIFY,
    uid: number,
    expr: string,
    angleUnit: AngleUnit,
    numeralBase: NumeralBase,
}

export type SimplifyResultSuccess = {
    type: RequestType.SIMPLIFY,
    uid: number,
    success: true,
    expr: string,
    result: string,
}

export type SimplifyResultError = {
    type: RequestType.SIMPLIFY,
    uid: number,
    success: false,
    expr: string,
    simplifyError: ParseException | string,
}

export type SimplifyResult = SimplifyResultSuccess | SimplifyResultError;

export type WorkerRequest = EvaluateOrSimplifyRequest | EvaluateRequest | SimplifyRequest;
export type WorkerResult = InitResult | EvaluateOrSimplifyResult | EvaluateResult | SimplifyResult;
