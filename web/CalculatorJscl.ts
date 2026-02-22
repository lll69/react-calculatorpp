export const enum AngleUnit {
    deg = "deg",
    rad = "rad",
    grad = "grad",
    turns = "turns",
}

export const enum NumeralBase {
    dec = "dec",
    hex = "hex",
    oct = "oct",
    bin = "bin",
}

export interface ParseException {
    position: number;
    expression: string;
    messageCode: string;
    params: string[];
}
