export interface JsclMathEngine {
}
export function initJscl(): void;
export function getMathEngine(): JsclMathEngine;
export function isParseException(e: any): boolean;
export function getErrorMessage(e: any): string;
export function pePosition(pe: any): number;
export function peExpression(pe: any): string;
export function peMessageCode(pe: any): string;
export function peParams(pe: any): string[];
export function evaluate(engine: JsclMathEngine, expr: string): string;
export function simplify(engine: JsclMathEngine, expr: string): string;
export function elementary(engine: JsclMathEngine, expr: string): string;
export function processExpr(engine: JsclMathEngine, expr: string): string;
export function setAngleUnits(engine: JsclMathEngine, unit: string): string;
export function setNumeralBase(engine: JsclMathEngine, base: string): string;
