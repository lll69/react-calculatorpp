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
export function evaluate(expr: string): string;
export function simplify(expr: string): string;
export function elementary(expr: string): string;
export function processExpr(expr: string): string;
export function setAngleUnits(unit: string): string;
export function setNumeralBase(base: string): string;
export function getMemory(): string;
export function setMemory(expr: string): string;
export function addMemory(): string;
export function subMemory(): string;
export function clearMemory(): string;
export function clearResult(): void;
