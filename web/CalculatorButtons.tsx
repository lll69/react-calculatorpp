import { useCallback } from "react";
import { Backspace, ContentCopy, ContentPaste, FastForward, FastRewind, FavoriteBorder, History, KeyboardArrowLeft, KeyboardArrowRight, Redo, Undo } from "@mui/icons-material";
import { CalculatorProps, MoveCursor } from "./CalculatorCommon";
import DragButton from "./DragButton";

export function HistoryButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text={<History fontSize="inherit" />}
            textUp={<Undo fontSize="inherit" />}
            textDown={<Redo fontSize="inherit" />}
            onClick={props.onHistory}
            onUpDrag={props.onUndo}
            onDownDrag={props.onRedo} />
    );
}

export function FavoriteButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text={<FavoriteBorder fontSize="inherit" />}
            onClick={props.onFavorite} />
    );
}

export function PercentButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="%"
            onClick={useCallback(() => props.onOp("%"), [props.onOp])} />
    );
}

export function PointButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="."
            textUp=","
            onClick={useCallback(() => props.onOp("."), [props.onOp])}
            onUpDrag={useCallback(() => props.onOp(","), [props.onOp])} />
    );
}

export function BracketButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="( )"
            textLeft="(…)"
            textUp="("
            textDown=")"
            onClick={useCallback(() => props.onBracketPair(false), [props.onBracketPair])}
            onLeftDrag={useCallback(() => props.onBracketPair(true), [props.onBracketPair])}
            onUpDrag={useCallback(() => props.onBracket("("), [props.onBracket])}
            onDownDrag={useCallback(() => props.onBracket(")"), [props.onBracket])} />
    );
}

export function EqualButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="transparent"
            noTextColor
            fontSize={props.buttonTextSize}
            text="="
            textUp="≡"
            onClick={props.onEqual}
            onUpDrag={props.onSimplify} />
    );
}

export function EraseButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="primaryDarkButton"
            fontSize={props.buttonTextSize}
            text={<Backspace fontSize="inherit" />}
            onClick={props.onErase}
            onMultiClick={props.onErase} />
    );
}

export function ClearButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="darkButton"
            fontSize={props.buttonTextSize}
            text="C"
            textUp={props.supportMemory ? "MC" : undefined}
            onClick={props.onClear}
            onUpDrag={props.onMemoryClear} />
    );
}

export function LeftButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text={<KeyboardArrowLeft fontSize="inherit" />}
            textUp={<FastRewind fontSize="inherit" />}
            textDown={<ContentCopy fontSize="inherit" />}
            onClick={useCallback(() => props.onMoveCursor(MoveCursor.LEFT), [props.onMoveCursor])}
            onUpDrag={useCallback(() => props.onMoveCursor(MoveCursor.START), [props.onMoveCursor])}
            onDownDrag={props.onCopy} />
    );
}

export function RightButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text={<KeyboardArrowRight fontSize="inherit" />}
            textUp={<FastForward fontSize="inherit" />}
            textDown={props.onPaste ? (<ContentPaste fontSize="inherit" />) : undefined}
            onClick={useCallback(() => props.onMoveCursor(MoveCursor.RIGHT), [props.onMoveCursor])}
            onUpDrag={useCallback(() => props.onMoveCursor(MoveCursor.END), [props.onMoveCursor])}
            onDownDrag={props.onPaste} />
    );
}

export function MemoryButton(props: CalculatorProps) {
    return (
        <DragButton
            transparent={!props.supportMemory}
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="M"
            textUp="M+"
            textDown="M-"
            onClick={props.onMemoryRequest}
            onUpDrag={props.onMemoryAdd}
            onDownDrag={props.onMemorySub} />
    );
}

export function VarButton(props: CalculatorProps) {
    const enterPi = useCallback(() => props.onVar("π"), [props.onVar]);
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text={props.onChooseVar ? (<i>π</i>) : "π"}
            textUp="π"
            textDown="e"
            onClick={props.onChooseVar || enterPi}
            onUpDrag={enterPi}
            onDownDrag={useCallback(() => props.onVar("e"), [props.onVar])} />
    );
}

export function FunButton(props: CalculatorProps) {
    return (
        <DragButton
            transparent={!props.onChooseFun}
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text={<i>ƒ</i>}
            textUp={props.onAddFun ? "+ƒ" : undefined}
            textDown={props.onAddVar ? "+π" : undefined}
            onClick={props.onChooseFun}
            onUpDrag={props.onAddFun}
            onDownDrag={props.onAddVar} />
    );
}

export function AddButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="primaryButton"
            fontSize={props.buttonTextSize}
            text="+"
            textUp="°"
            textDown="Σ"
            onClick={useCallback(() => props.onOp("+"), [props.onOp])}
            onUpDrag={useCallback(() => props.onOp("°"), [props.onOp])}
            onDownDrag={useCallback(() => props.onFun("Σ"), [props.onFun])} />
    );
}

export function SubButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="primaryButton"
            fontSize={props.buttonTextSize}
            text="-"
            textUp="∂"
            textDown="∫"
            onClick={useCallback(() => props.onOp("-"), [props.onOp])}
            onUpDrag={useCallback(() => props.onFun("∂"), [props.onFun])}
            onDownDrag={useCallback(() => props.onFun("∫"), [props.onFun])} />
    );
}

export function MulButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="primaryButton"
            fontSize={props.buttonTextSize}
            text="×"
            textUp="^"
            textDown="^2"
            onClick={useCallback(() => props.onOp("*"), [props.onOp])}
            onUpDrag={useCallback(() => props.onOp("^"), [props.onOp])}
            onDownDrag={useCallback(() => props.onOp("^2"), [props.onOp])} />
    );
}

export function DivButton(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="primaryButton"
            fontSize={props.buttonTextSize}
            text="/"
            textUp="√"
            textDown="∛"
            onClick={useCallback(() => props.onOp("/"), [props.onOp])}
            onUpDrag={useCallback(() => props.onFun("√"), [props.onOp])}
            onDownDrag={useCallback(() => props.onFun("√3"), [props.onOp])} />
    );
}

export function Button0(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="0"
            textUp="000"
            textDown="00"
            onClick={useCallback(() => props.onNum("0"), [props.onNum])}
            onUpDrag={useCallback(() => props.onNum("000"), [props.onNum])}
            onDownDrag={useCallback(() => props.onNum("00"), [props.onNum])} />
    );
}

export function Button1(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="1"
            textLeft="A"
            textUp="sin"
            textDown="asin"
            onClick={useCallback(() => props.onNum("1"), [props.onNum])}
            onLeftDrag={useCallback(() => props.onNum("A"), [props.onNum])}
            onUpDrag={useCallback(() => props.onFun("sin"), [props.onFun])}
            onDownDrag={useCallback(() => props.onFun("asin"), [props.onFun])} />
    );
}

export function Button2(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="2"
            textLeft="B"
            textUp="cos"
            textDown="acos"
            onClick={useCallback(() => props.onNum("2"), [props.onNum])}
            onLeftDrag={useCallback(() => props.onNum("B"), [props.onNum])}
            onUpDrag={useCallback(() => props.onFun("cos"), [props.onFun])}
            onDownDrag={useCallback(() => props.onFun("acos"), [props.onFun])} />
    );
}

export function Button3(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="3"
            textLeft="C"
            textUp="tan"
            textDown="atan"
            onClick={useCallback(() => props.onNum("3"), [props.onNum])}
            onLeftDrag={useCallback(() => props.onNum("C"), [props.onNum])}
            onUpDrag={useCallback(() => props.onFun("tan"), [props.onFun])}
            onDownDrag={useCallback(() => props.onFun("atan"), [props.onFun])} />
    );
}

export function Button4(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="4"
            textLeft="D"
            textUp="x"
            textDown="y"
            onClick={useCallback(() => props.onNum("4"), [props.onNum])}
            onLeftDrag={useCallback(() => props.onNum("D"), [props.onNum])}
            onUpDrag={useCallback(() => props.onVar("x"), [props.onVar])}
            onDownDrag={useCallback(() => props.onVar("y"), [props.onVar])} />
    );
}

export function Button5(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="5"
            textLeft="E"
            textUp="t"
            textDown="j"
            onClick={useCallback(() => props.onNum("5"), [props.onNum])}
            onLeftDrag={useCallback(() => props.onNum("E"), [props.onNum])}
            onUpDrag={useCallback(() => props.onVar("t"), [props.onVar])}
            onDownDrag={useCallback(() => props.onVar("j"), [props.onVar])} />
    );
}

export function Button6(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="6"
            textLeft="F"
            textUp="a"
            textDown="b"
            onClick={useCallback(() => props.onNum("6"), [props.onNum])}
            onLeftDrag={useCallback(() => props.onNum("F"), [props.onNum])}
            onUpDrag={useCallback(() => props.onVar("a"), [props.onVar])}
            onDownDrag={useCallback(() => props.onVar("b"), [props.onVar])} />
    );
}

export function Button7(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="7"
            textLeft="0b:"
            textUp="i"
            textDown="!"
            onClick={useCallback(() => props.onNum("7"), [props.onNum])}
            onLeftDrag={useCallback(() => props.onOp("0b:"), [props.onOp])}
            onUpDrag={useCallback(() => props.onVar("i"), [props.onVar])}
            onDownDrag={useCallback(() => props.onOp("!"), [props.onOp])} />
    );
}

export function Button8(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="8"
            textLeft="0d:"
            textUp="ln"
            textDown="lg"
            onClick={useCallback(() => props.onNum("8"), [props.onNum])}
            onLeftDrag={useCallback(() => props.onOp("0d:"), [props.onOp])}
            onUpDrag={useCallback(() => props.onFun("ln"), [props.onFun])}
            onDownDrag={useCallback(() => props.onFun("lg"), [props.onFun])} />
    );
}

export function Button9(props: CalculatorProps) {
    return (
        <DragButton
            bgColor="normalButton"
            fontSize={props.buttonTextSize}
            text="9"
            textLeft="0x:"
            textUp="log"
            textDown="∫ab"
            onClick={useCallback(() => props.onNum("9"), [props.onNum])}
            onLeftDrag={useCallback(() => props.onOp("0x:"), [props.onOp])}
            onUpDrag={useCallback(() => props.onFun("log"), [props.onFun])}
            onDownDrag={useCallback(() => props.onFun("∫ab"), [props.onFun])} />
    );
}
