import { FocusEventHandler, FormEventHandler, MouseEvent, Ref, useCallback, useState } from "react";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, PopoverOrigin, styled, SxProps } from "@mui/material";
import { KeyboardArrowLeft, Launch, MoreVert } from "@mui/icons-material";
import { StyledDiv, FilledTextArea } from "./CalculatorStyled";
import { msgs, S } from "./CalculatorL10n";
import { AngleUnit, NumeralBase } from "./CalculatorJscl";
import { GITHUB_URL } from "./build_config";

interface CalculatorEditorProps {
    readonly?: boolean;
    textRef: Ref<HTMLTextAreaElement>;
    defaultValue?: string;
    value?: string;
    angleUnit: AngleUnit;
    numeralBase: NumeralBase;
    textOnFocus: FocusEventHandler<HTMLTextAreaElement>;
    textOnBlur: FocusEventHandler<HTMLTextAreaElement>;
    textOnInput: FormEventHandler<HTMLTextAreaElement>;
    setAngleUnit: (unit: AngleUnit) => void;
    setNumeralBase: (base: NumeralBase) => void;
    openHistoryPage: () => void;
}

const parentSx: SxProps = {
    backgroundColor: "background.default",
    color: "text.primary",
    position: "relative",
    display: "flex",
};

const textSx: SxProps = {
    backgroundColor: "background.default",
    color: "text.primary",
    fontSize: "32px",
    margin: "0",
    resize: "none",
    border: "none",
    display: "block",
    width: "100%",
    height: "100%",
};

const MenuContainer = styled("div")({
    display: "flex",
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-end",
});

const anchorTR: PopoverOrigin = {
    vertical: "top",
    horizontal: "right",
};

export default function CalculatorEditor(props: CalculatorEditorProps) {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [anglesAnchor, setAnglesAnchor] = useState<HTMLElement | null>(null);
    const [radixAnchor, setRadixAnchor] = useState<HTMLElement | null>(null);
    const openMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(e.currentTarget);
    }, []);
    const closeMenu = useCallback(() => {
        setMenuAnchor(null);
    }, []);
    const openAnglesMenu = useCallback((e: MouseEvent<HTMLLIElement>) => {
        setAnglesAnchor(e.currentTarget);
    }, []);
    const closeAnglesMenu = useCallback(() => {
        setAnglesAnchor(null);
    }, []);
    const mapAngles = useCallback((unit: AngleUnit) => {
        switch (unit) {
            case AngleUnit.deg:
                return msgs[S.cpp_deg];
            case AngleUnit.rad:
                return msgs[S.cpp_rad];
            case AngleUnit.grad:
                return msgs[S.cpp_grad];
            case AngleUnit.turns:
                return msgs[S.cpp_turns];
        }
    }, []);
    const wrapAngleClick = (unit: AngleUnit) => useCallback(() => { props.setAngleUnit(unit); closeAnglesMenu(); }, [props.setAngleUnit]);
    const openRadixMenu = useCallback((e: MouseEvent<HTMLLIElement>) => {
        setRadixAnchor(e.currentTarget);
    }, []);
    const closeRadixMenu = useCallback(() => {
        setRadixAnchor(null);
    }, []);
    const mapRadix = useCallback((base: NumeralBase) => {
        switch (base) {
            case NumeralBase.bin:
                return msgs[S.cpp_bin];
            case NumeralBase.oct:
                return msgs[S.cpp_oct];
            case NumeralBase.dec:
                return msgs[S.cpp_dec];
            case NumeralBase.hex:
                return msgs[S.cpp_hex];
        }
    }, []);
    const wrapRadixClick = (base: NumeralBase) => useCallback(() => { props.setNumeralBase(base); closeRadixMenu(); }, [props.setNumeralBase]);
    return (
        <StyledDiv sx={parentSx}>
            <FilledTextArea
                sx={textSx}
                inputMode="none"
                readOnly={props.readonly}
                ref={props.textRef}
                defaultValue={props.defaultValue}
                value={props.value}
                onBlur={props.textOnBlur}
                onFocus={props.textOnFocus}
                onInput={props.textOnInput} />
            <MenuContainer>
                <IconButton onClick={openMenu}><MoreVert /></IconButton>
                <Menu
                    anchorEl={menuAnchor}
                    anchorOrigin={anchorTR}
                    transformOrigin={anchorTR}
                    open={menuAnchor !== null}
                    onClose={closeMenu}>
                    <MenuItem onClick={openAnglesMenu}><b>{msgs[S.cpp_angles]}</b>{": "}{mapAngles(props.angleUnit)}</MenuItem>
                    <MenuItem onClick={openRadixMenu}><b>{msgs[S.cpp_radix]}</b>{": "}{mapRadix(props.numeralBase)}</MenuItem>
                    <MenuItem onClick={props.openHistoryPage}>{msgs[S.c_history]}</MenuItem>
                    <MenuItem component="a" href={GITHUB_URL}>{msgs[S.cpp_about]}{" "}<Launch /></MenuItem>
                </Menu>
                <Menu
                    anchorEl={anglesAnchor}
                    anchorOrigin={anchorTR}
                    transformOrigin={anchorTR}
                    open={anglesAnchor !== null}
                    onClose={closeAnglesMenu}>
                    <MenuItem onClick={closeAnglesMenu}>
                        <ListItemIcon><KeyboardArrowLeft fontSize="small" /></ListItemIcon>
                        <ListItemText>{msgs[S.cpp_angles]}</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={wrapAngleClick(AngleUnit.deg)}>{msgs[S.cpp_deg]}</MenuItem>
                    <MenuItem onClick={wrapAngleClick(AngleUnit.rad)}>{msgs[S.cpp_rad]}</MenuItem>
                    <MenuItem onClick={wrapAngleClick(AngleUnit.grad)}>{msgs[S.cpp_grad]}</MenuItem>
                    <MenuItem onClick={wrapAngleClick(AngleUnit.turns)}>{msgs[S.cpp_turns]}</MenuItem>
                </Menu>
                <Menu
                    anchorEl={radixAnchor}
                    anchorOrigin={anchorTR}
                    transformOrigin={anchorTR}
                    open={radixAnchor !== null}
                    onClose={closeRadixMenu}>
                    <MenuItem onClick={closeRadixMenu}>
                        <ListItemIcon><KeyboardArrowLeft fontSize="small" /></ListItemIcon>
                        <ListItemText>{msgs[S.cpp_radix]}</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={wrapRadixClick(NumeralBase.bin)}>{msgs[S.cpp_bin]}</MenuItem>
                    <MenuItem onClick={wrapRadixClick(NumeralBase.oct)}>{msgs[S.cpp_oct]}</MenuItem>
                    <MenuItem onClick={wrapRadixClick(NumeralBase.dec)}>{msgs[S.cpp_dec]}</MenuItem>
                    <MenuItem onClick={wrapRadixClick(NumeralBase.hex)}>{msgs[S.cpp_hex]}</MenuItem>
                </Menu>
            </MenuContainer>
        </StyledDiv>
    )
}
