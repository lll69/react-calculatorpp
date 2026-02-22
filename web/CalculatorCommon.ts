import { ReactElement } from "react";

export const enum MoveCursor {
    LEFT,
    RIGHT,
    START,
    END,
}

export interface CalculatorProps {
    editor: ReactElement;
    result: ReactElement;
    buttonTextSize?: number;
    supportMemory?: boolean;
    onNum: (num: string) => void;
    onPoint: () => void;
    onOp: (op: string) => void;
    onVar: (v: string) => void;
    onFun: (f: string) => void;
    onEqual: () => void;
    onSimplify: () => void;
    onErase: () => void;
    onClear: () => void;
    onMemoryRequest?: () => void;
    onMemoryClear?: () => void;
    onMemoryAdd?: () => void;
    onMemorySub?: () => void;
    onBracket: (bracket: string) => void;
    onBracketPair: (space: boolean) => void;
    onMoveCursor: (mv: MoveCursor) => void;
    onCopy: () => void;
    onPaste?: () => void;
    onChooseVar?: () => void;
    onChooseFun?: () => void;
    onAddVar?: () => void;
    onAddFun?: () => void;
    onFavorite: () => void;
    onHistory: () => void;
    onUndo: () => void;
    onRedo: () => void;
}
