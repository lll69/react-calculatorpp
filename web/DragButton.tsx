import { ButtonBase, styled } from "@mui/material";
import { memo, PointerEvent, ReactElement, useCallback, useMemo, useRef } from "react";

const DEFAULT_FONT_SIZE = 32;
const TOUCH_SLOP = 15;
const TOUCH_SLOP_SQUARED = TOUCH_SLOP * TOUCH_SLOP;
const MIN_DRAG_TIME = 40;
const MAX_DRAG_TIME = 2500;
const LONG_PRESS_TIMEOUT = 400;
const LONG_PRESS_INITIAL_DELAY = 300;
const LONG_PRESS_MIN_DELAY = 50;
const LONG_PRESS_DELAY_FACTOR = 2 / 3;

const invokeDelayed = setTimeout;
const clearDelay = clearTimeout;
const atan2 = Math.atan2;
const max = Math.max;
const PI = Math.PI;

export interface DragButtonProps {
    fontSize?: number,
    bgColor?: string,
    noTextColor?: boolean,
    transparent?: boolean,
    text?: string | ReactElement,
    textUp?: string | ReactElement,
    textDown?: string | ReactElement,
    textLeft?: string | ReactElement,
    onClick?: () => void,
    onLeftDrag?: () => void,
    onUpDrag?: () => void,
    onDownDrag?: () => void,
    onMultiClick?: () => void;
}

const TouchButton = styled(ButtonBase)({
    touchAction: "none",
    width: "100%",
    height: "100%",
});

const HoverDiv = styled("div")({
    position: "absolute",
    width: "100%",
    height: "100%",
    transition: "background-color linear 0.1s",
    backgroundColor: "transparent",
    pointerEvents: "none",
    "&.hover,&.pressed": {
        backgroundColor: "rgba(232,230,227,0.2)",
    },
});

const MainText = styled("div")({
    position: "absolute",
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
});

const UpText = styled("div")({
    position: "absolute",
    display: "flex",
    fontSize: "0.4em",
    opacity: "0.5",
    width: "100%",
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    pointerEvents: "none",
});

const DownText = styled("div")({
    position: "absolute",
    display: "flex",
    fontSize: "0.4em",
    opacity: "0.5",
    width: "100%",
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    pointerEvents: "none",
});

const LeftText = styled("div")({
    position: "absolute",
    display: "flex",
    fontSize: "0.4em",
    opacity: "0.5",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    pointerEvents: "none",
});

const PaddingText = styled("div")({
    padding: "4px",
});

export default memo((props: DragButtonProps) => {
    const longPressTimeout = useRef<any>(-1);
    const longPressDelay = useRef<number>(0);
    const pressX = useRef<number>(0);
    const pressY = useRef<number>(0);
    const pressed = useRef<boolean>(false);
    const pointerIsOut = useRef<boolean>(false);
    const pressPointerId = useRef<number>(0);
    const pressTime = useRef<number>(0);
    const buttonRef = useRef(null);
    const hovering = useRef<boolean>(false);
    const hoverDivRef = useRef<HTMLDivElement | null>(null);
    const fontSize = props.fontSize || DEFAULT_FONT_SIZE;

    const handleMultiClick = () => {
        if (props.onMultiClick) props.onMultiClick();
        longPressDelay.current = max(LONG_PRESS_MIN_DELAY, longPressDelay.current * LONG_PRESS_DELAY_FACTOR);
        longPressTimeout.current = invokeDelayed(handleMultiClick, longPressDelay.current);
    };

    const startLongPress = () => {
        longPressDelay.current = LONG_PRESS_INITIAL_DELAY;
        handleMultiClick();
    };

    const eventHandler = useCallback((e: PointerEvent) => {
        switch (e.type) {
            case "pointerdown":
                if (!pressed.current) {
                    pressed.current = true;
                    pointerIsOut.current = false;
                    pressX.current = e.pageX;
                    pressY.current = e.pageY;
                    pressPointerId.current = e.pointerId;
                    pressTime.current = e.timeStamp;
                    const button = buttonRef.current as (HTMLElement | null);
                    if (button) {
                        button.setPointerCapture(e.pointerId);
                    }
                    if (props.onMultiClick) {
                        longPressTimeout.current = invokeDelayed(startLongPress, LONG_PRESS_TIMEOUT);
                    }
                    if (hoverDivRef.current && !hoverDivRef.current.classList.contains("pressed")) {
                        hoverDivRef.current.classList.add("pressed");
                    }
                }
                break;
            case "pointerenter":
                if (e.pointerType === "mouse") {
                    if (!hovering.current && hoverDivRef.current) {
                        hovering.current = true;
                        hoverDivRef.current.classList.add("hover");
                    }
                }
                break;
            case "pointerleave":
                if (e.pointerType === "mouse") {
                    if (hovering.current && hoverDivRef.current) {
                        hovering.current = false;
                        hoverDivRef.current.classList.remove("hover");
                    }
                }
                if (pressPointerId.current === e.pointerId) {
                    pointerIsOut.current = true;
                    clearDelay(longPressTimeout.current);
                }
                break;
            case "pointercancel":
                if (pressPointerId.current === e.pointerId) {
                    pressed.current = false;
                    clearDelay(longPressTimeout.current);
                    if (hoverDivRef.current) {
                        hoverDivRef.current.classList.remove("pressed");
                    }
                }
                break;
            case "pointerup":
                if (pressed.current && pressPointerId.current === e.pointerId) {
                    pressed.current = false;
                    clearDelay(longPressTimeout.current);
                    if (hoverDivRef.current) {
                        hoverDivRef.current.classList.remove("pressed");
                    }
                    const dt = e.timeStamp - pressTime.current;
                    const dx = e.pageX - pressX.current;
                    const dy = e.pageY - pressY.current;
                    const distanceSquared = dx * dx + dy * dy;
                    if (dt < MIN_DRAG_TIME || dt > MAX_DRAG_TIME || distanceSquared < TOUCH_SLOP_SQUARED) {
                        const clickHandler = props.onClick;
                        if (clickHandler) {
                            invokeDelayed(clickHandler, 0);
                        }
                        break;
                    }
                    const angle = atan2(-dy, dx) * 180 / PI;
                    if (angle >= 45 && angle < 135) {
                        // up
                        if (props.onUpDrag) props.onUpDrag();
                    } else if (angle >= -135 && angle < -45) {
                        // down
                        if (props.onDownDrag) props.onDownDrag();
                    } else if (angle >= -45 && angle < 45) {
                        // right
                    } else {
                        // left
                        if (props.onLeftDrag) props.onLeftDrag();
                    }
                }
                break;
        }
    }, [props.onMultiClick, props.onClick, props.onUpDrag, props.onDownDrag, props.onLeftDrag]);

    return (
        <TouchButton
            style={useMemo(() => ({ fontSize: fontSize }), [fontSize])}
            sx={useMemo(() => ({
                backgroundColor: props.bgColor,
                color: props.noTextColor ? null : "white",
                visibility: props.transparent ? "hidden" : null,
            }), [props.bgColor, props.noTextColor, props.transparent])}
            ref={buttonRef}
            onPointerDown={eventHandler}
            onPointerUp={eventHandler}
            onPointerCancel={eventHandler}
            onPointerEnter={eventHandler}
            onPointerLeave={eventHandler}
            focusRipple>
            <HoverDiv ref={hoverDivRef} />
            <MainText>{props.text}</MainText>
            {props.textLeft ? (
                <LeftText><PaddingText>{props.textLeft}</PaddingText></LeftText>
            ) : null}
            {props.textUp ? (
                <UpText><PaddingText>{props.textUp}</PaddingText></UpText>
            ) : null}
            {props.textDown ? (
                <DownText><PaddingText>{props.textDown}</PaddingText></DownText>
            ) : null}
        </TouchButton>
    );
});
