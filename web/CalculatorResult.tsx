import { memo, Ref, useMemo } from "react";
import { SxProps } from "@mui/material";
import { FilledTextArea } from "./CalculatorStyled";

interface CalculatorResultProps {
    textRef: Ref<HTMLTextAreaElement>;
    defaultValue?: string;
    value?: string;
    opacity?: number;
}

const textSx: SxProps = {
    backgroundColor: "background.default",
    color: "text.primary",
    fontSize: "32px",
    margin: "0",
    resize: "none",
    border: "none",
    textAlign: "right",
}

export default memo((props: CalculatorResultProps) => {
    return (
        <FilledTextArea
            sx={textSx}
            style={useMemo(() => ({ opacity: props.opacity }), [props.opacity])}
            readOnly
            ref={props.textRef}
            defaultValue={props.defaultValue}
            value={props.value} />
    );
});
