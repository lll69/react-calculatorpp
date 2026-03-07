import { AngleUnit, NumeralBase, ParseException } from "./CalculatorJscl";

export const WORKER_VERSION = "2";

export const enum RequestType {
    EVALUATE = "evaluate",
    SIMPLIFY = "simplify",
    EVALUATE_OR_SIMPLIFY = "eval/simp",
    GET_MEMORY = "getMem",
    SET_MEMORY = "setMem",
    ADD_MEMORY = "addMem",
    SUB_MEMORY = "subMem",
    CLEAR_MEMORY = "clrMem",
    CLEAR_RESULT = "clrRes",
}

export type InitResult = {
    type: "init",
    version: string,
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

export type GetMemoryRequest = {
    type: RequestType.GET_MEMORY,
    uid: number,
    angleUnit: AngleUnit,
    numeralBase: NumeralBase,
}

export type GetMemoryResultSuccess = {
    type: RequestType.GET_MEMORY,
    uid: number,
    success: true,
    result: string,
}

export type GetMemoryResultError = {
    type: RequestType.GET_MEMORY,
    uid: number,
    success: false,
    error: ParseException | string,
}

export type GetMemoryResult = GetMemoryResultSuccess | GetMemoryResultError;

export type SetMemoryRequest = {
    type: RequestType.SET_MEMORY,
    uid: number,
    expr: string,
    angleUnit: AngleUnit,
    numeralBase: NumeralBase,
}

export type SetMemoryResultSuccess = {
    type: RequestType.SET_MEMORY,
    uid: number,
    success: true,
    expr: string,
    result: string,
}

export type SetMemoryResultError = {
    type: RequestType.SET_MEMORY,
    uid: number,
    success: false,
    expr: string,
    error: ParseException | string,
}

export type SetMemoryResult = SetMemoryResultSuccess | SetMemoryResultError;

export type AddMemoryRequest = {
    type: RequestType.ADD_MEMORY,
    uid: number,
    angleUnit: AngleUnit,
    numeralBase: NumeralBase,
}

export type AddMemoryResultSuccess = {
    type: RequestType.ADD_MEMORY,
    uid: number,
    success: true,
    result: string,
}

export type AddMemoryResultError = {
    type: RequestType.ADD_MEMORY,
    uid: number,
    success: false,
    error: ParseException | string,
}

export type AddMemoryResult = AddMemoryResultSuccess | AddMemoryResultError;

export type SubMemoryRequest = {
    type: RequestType.SUB_MEMORY,
    uid: number,
    angleUnit: AngleUnit,
    numeralBase: NumeralBase,
}

export type SubMemoryResultSuccess = {
    type: RequestType.SUB_MEMORY,
    uid: number,
    success: true,
    result: string,
}

export type SubMemoryResultError = {
    type: RequestType.SUB_MEMORY,
    uid: number,
    success: false,
    error: ParseException | string,
}

export type SubMemoryResult = SubMemoryResultSuccess | SubMemoryResultError;

export type ClearMemoryRequest = {
    type: RequestType.CLEAR_MEMORY,
    uid: number,
    angleUnit: AngleUnit,
    numeralBase: NumeralBase, 
}

export type ClearMemoryResultSuccess = {
    type: RequestType.CLEAR_MEMORY,
    uid: number,
    success: true,
    result: string,
}

export type ClearMemoryResultError = {
    type: RequestType.CLEAR_MEMORY,
    uid: number,
    success: false,
    error: ParseException | string,
}

export type ClearMemoryResult = ClearMemoryResultSuccess | ClearMemoryResultError;

export type ClearResultRequest = {
    type: RequestType.CLEAR_RESULT,
    uid: number,
}

export type ClearResultResult = {
    type: RequestType.CLEAR_RESULT,
    uid: number,
    success: true,
}

export type WorkerRequest = EvaluateOrSimplifyRequest
    | EvaluateRequest | SimplifyRequest
    | GetMemoryRequest | SetMemoryRequest
    | AddMemoryRequest | SubMemoryRequest
    | ClearMemoryRequest | ClearResultRequest;
export type WorkerResult = InitResult | EvaluateOrSimplifyResult
    | EvaluateResult | SimplifyResult
    | GetMemoryResult | SetMemoryResult
    | AddMemoryResult | SubMemoryResult
    | ClearMemoryResult | ClearResultResult;
