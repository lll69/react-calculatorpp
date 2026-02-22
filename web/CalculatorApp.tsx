import { createElement, Dispatch, MutableRefObject, ReactElement, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sprintf } from "sprintf-js";
import { AppBar, Box, Button, Container, createTheme, CssBaseline, Fab, IconButton, List, ListItem, ListItemButton, ListItemText, styled, ThemeProvider, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { teal } from "@mui/material/colors";
import { ArrowBack, Delete } from "@mui/icons-material";
import CalculatorPortrait from "./CalculatorPortrait";
import CalculatorLandscape from "./CalculatorLandscape";
import CalculatorEditor from "./CalculatorEditor";
import CalculatorResult from "./CalculatorResult";
import { CalculatorProps, MoveCursor } from "./CalculatorCommon";
import { AngleUnit, NumeralBase, ParseException } from "./CalculatorJscl";
import { jsclMsgs, msgs, S } from "./CalculatorL10n";
import { WorkerState, useWorker } from "./CalculatorWorker";
import DragButton from "./DragButton";
import { EvaluateOrSimplifyResult, EvaluateResultError, RequestType, SimplifyResultError, WorkerRequest, WorkerResult } from "./worker_types";
import { bgSx, ScrollableFilledBox } from "./CalculatorStyled";
import { CalculatorFunctionSelect, CalculatorVariableSelect } from "./CalculatorSelect";
import { GITHUB_URL } from "./build_config";

const DEFAULT_FONT_SIZE = 32;
const enum Page {
    WIZARD,
    MAIN,
    HISTORY,
    SELECT_VARIABLE,
    SELECT_FUNCTION,
}
const enum WizardState {
    CENTER,
    UP,
    DOWN,
    END,
}
const enum CalcHistoryOption {
    ADD_HISTORY,
    REPLACE_HISTORY,
    NO_HISTORY,
}
type HistoryItem = [uid: number, expr: string, equalChar: string, result: string, pos: number, resultNotReady: boolean];

const floor = Math.floor;
const min = Math.min;
const max = Math.max;

const copyText = (str: string) => {
    const D = document, element = D.createElement("input");
    element.style.opacity = "0";
    element.value = str;
    D.body.appendChild(element);
    element.select();
    D.execCommand("copy");
    element.remove();
}

const themeBase = createTheme({ palette: { mode: "light" } });
const themeDarkBase = createTheme({ palette: { mode: "dark" } });
const themeLight = createTheme(themeBase, {
    palette: {
        mode: "light",
        primary: themeBase.palette.augmentColor({
            color: {
                main: teal[500],
            },
        }),
        background: {
            default: "#f5f5f5",
            paper: "#f5f5f5",
        },
        normalButton: "#424242",
        darkButton: "#313131",
        primaryButton: teal[400],
        primaryDarkButton: teal[500],
    },
});
const themeDark = createTheme(themeDarkBase, {
    palette: {
        mode: "dark",
        primary: themeDarkBase.palette.augmentColor({
            color: {
                main: "#1156b1",
            },
        }),
        background: {
            default: "#101010",
            paper: "#101010",
        },
        normalButton: "#212121",
        darkButton: "#313131",
        primaryButton: "#0d47a1",
        primaryDarkButton: "#1156b1",
    },
});

const FilledBox = styled(Box)({
    width: "100%",
    height: "100%",
});

const CenterContainer = styled(Container)({
    textAlign: "center",
});

const InlineDiv = styled("div")({
    display: "inline-block",
});

const BottomFab = styled(Fab)({
    position: "absolute",
    bottom: 16,
    right: 16,
});

const wizardStringMap = {
    [WizardState.CENTER]: S.cpp_wizard_dragbutton_action_center,
    [WizardState.UP]: S.cpp_wizard_dragbutton_action_up,
    [WizardState.DOWN]: S.cpp_wizard_dragbutton_action_down,
    [WizardState.END]: S.cpp_wizard_dragbutton_action_end,
};

const useCalculatorSize: (() => [number, number, boolean, Dispatch<SetStateAction<HTMLDivElement | null>>]) = () => {
    const [landscape, setLandscape] = useState(false);
    const [buttonSize, setButtonSize] = useState(DEFAULT_FONT_SIZE * 2);
    const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (container) {
            {
                const initialRect = container.getBoundingClientRect();
                setLandscape(initialRect.width > initialRect.height);
            }
            const observer = new ResizeObserver(entries => {
                const contentRect = entries[0].contentRect;
                const newLandscape = contentRect.width > contentRect.height;
                const buttonSize = contentRect.height / (newLandscape ? 6 : 8);
                setLandscape(newLandscape);
                setButtonSize(buttonSize);
                setFontSize(floor(buttonSize / 2));
            });
            observer.observe(container);
            return () => {
                observer.disconnect();
            };
        }
    }, [container]);

    return [buttonSize, fontSize, landscape, setContainer];
};

const AppWizard = ({ buttonSize, fontSize, setPage }: {
    buttonSize: number, fontSize: number, setPage: (page: Page) => void
}) => {
    const [wizardState, setWizardState] = useState<WizardState>(WizardState.CENTER);
    return (
        <CenterContainer>
            <br />
            <p>{msgs[S.cpp_wizard_dragbutton_description]}</p>
            <br />
            <p>{msgs[wizardStringMap[wizardState]]}</p>
            <br />
            <div style={useMemo(() => ({
                display: "inline-block",
                width: buttonSize,
                height: buttonSize,
            }), [buttonSize])}>
                <DragButton
                    bgColor="primaryButton"
                    fontSize={fontSize}
                    text="9"
                    textUp="%"
                    textDown="^2"
                    onClick={useCallback(() => {
                        if (wizardState === WizardState.CENTER) setWizardState(WizardState.UP);
                        else if (wizardState === WizardState.END) setWizardState(WizardState.CENTER);
                    }, [wizardState])}
                    onUpDrag={useCallback(() => {
                        if (wizardState === WizardState.UP) setWizardState(WizardState.DOWN);
                    }, [wizardState])}
                    onDownDrag={useCallback(() => {
                        if (wizardState === WizardState.DOWN) setWizardState(WizardState.END);
                    }, [wizardState])} />
            </div>
            <br />
            <br />
            <InlineDiv>
                <Button
                    onClick={useCallback(() => setPage(Page.MAIN), [])}
                    variant="contained">
                    {msgs[S.cpp_wizard_finish]}
                </Button>
            </InlineDiv>
        </CenterContainer>
    );
};

const CalculatorHistory = ({ historyItems, enterHistory, clearHistory, exit }: {
    historyItems: HistoryItem[], enterHistory: (item: HistoryItem) => void, clearHistory: () => void, exit: () => void
}) => {
    const reversedHistoryItems = useMemo(() => [...historyItems].reverse(), [historyItems]);
    return (
        <>
            <AppBar>
                <Toolbar>
                    <IconButton
                        size="large"
                        color="inherit"
                        edge="start"
                        onClick={exit}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        {msgs[S.c_history]}
                    </Typography>
                </Toolbar>
            </AppBar>
            <ScrollableFilledBox>
                <Container sx={bgSx}>
                    <List>
                        <Toolbar />
                        {reversedHistoryItems.map((item: HistoryItem) => (
                            <ListItem
                                key={item[0]}
                                disablePadding>
                                <ListItemButton
                                    onClick={useCallback(() => enterHistory(item), [enterHistory])}
                                    component="button">
                                    <ListItemText primary={item[1] + item[2] + item[3]} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Container>
            </ScrollableFilledBox>
            <BottomFab color="primary" onClick={clearHistory}>
                <Delete />
            </BottomFab>
        </>
    );
};

const Calculator = ({ landscape, fontSize, workerState, workerMessageRef, historyItems, page, setPage }:
    {
        landscape: boolean, fontSize: number, workerState: WorkerState,
        workerMessageRef: MutableRefObject<((e: MessageEvent<WorkerResult>) => void) | undefined>,
        historyItems: HistoryItem[],
        page: Page,
        setPage: (page: Page) => void
    }) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const textAreaHasFocus = useRef<boolean>(false);
    const textAreaValueForRender = useRef<string>("");
    const resultTextRef = useRef<HTMLTextAreaElement>(null);
    const [resultNotReady, setResultNotReady] = useState<boolean>(true);
    const [needReplaceResult, setNeedReplaceResult] = useState<boolean>(true);
    const [result, setResult] = useState<string>("");
    const lastCursorPos = useRef<number>(0);
    // lastCursorRange is never used in cpp
    const lastCursorRange: { start: number, end: number } = useMemo(() => ({ start: 0, end: 0 }), []);
    const workerBusy = useRef<boolean>(false);
    const calcUid = useRef<number>(0);
    const [workerRef, workerLoadError, reInitWorker] = workerState;
    const [angleUnit, setAngleUnit] = useState<AngleUnit>(AngleUnit.rad);
    const [numeralBase, setNumeralBase] = useState<NumeralBase>(NumeralBase.dec);
    const lastCalculateType = useRef<RequestType | null>(null);
    const calcWithHistory = useRef<CalcHistoryOption>(CalcHistoryOption.ADD_HISTORY);
    const historyPtr = useRef<number>(-1);
    const variableToEnter = useRef<string | null>(null);
    const functionToEnter = useRef<string | null>(null);

    const setTextRef = useCallback((textArea: HTMLTextAreaElement | null) => {
        const isAttach = textAreaRef.current === null && textArea !== null;
        textAreaRef.current = textArea;
        if (isAttach) {
            textArea.selectionStart = textArea.selectionEnd = lastCursorPos.current;
            if (variableToEnter.current !== null) {
                insertString(variableToEnter.current);
                variableToEnter.current = null;
            } else if (functionToEnter.current !== null) {
                insertFun(functionToEnter.current);
                functionToEnter.current = null;
            } else {
                textArea.focus();
            }
        }
    }, [textAreaRef]);

    const onSelectionChange = useCallback(() => {
        const selection = document.getSelection();
        const textArea = textAreaRef.current;
        if (selection && textArea && textAreaHasFocus.current) {
            const startPos = textArea.selectionStart, endPos = textArea.selectionEnd;
            if (startPos === endPos) {
                lastCursorPos.current = startPos;
            } else {
                lastCursorRange.start = startPos;
                lastCursorRange.end = endPos;
            }
        }
    }, []);

    const addHistoryItem = useCallback((item: HistoryItem) => {
        if (historyItems.length === 0 && calcWithHistory.current === CalcHistoryOption.REPLACE_HISTORY) {
            calcWithHistory.current = CalcHistoryOption.ADD_HISTORY;
        }
        switch (calcWithHistory.current) {
            case CalcHistoryOption.ADD_HISTORY:
                historyItems.push(item);
                break;
            case CalcHistoryOption.REPLACE_HISTORY:
                historyItems[historyItems.length - 1] = item;
                break;
        }
        historyPtr.current = historyItems.length - 1;
    }, []);

    workerMessageRef.current = useCallback((e: MessageEvent<WorkerResult>) => {
        const result = e.data;
        switch (result.type) {
            case RequestType.EVALUATE_OR_SIMPLIFY:
            case RequestType.EVALUATE:
            case RequestType.SIMPLIFY:
                workerBusy.current = false;
                lastCalculateType.current = result.type;
                const equalChar = (result.success && ((result as EvaluateOrSimplifyResult).resultType || result.type) === RequestType.SIMPLIFY) ? "≡" : "=";
                if (result.success) {
                    setResultNotReady(false);
                    setNeedReplaceResult(false);
                    setResult(result.result);
                    addHistoryItem([result.uid, result.expr, equalChar, result.result, result.expr.length, false])
                } else {
                    setResultNotReady(true);
                    setNeedReplaceResult(true);
                    const error: ParseException | string = (result as SimplifyResultError).simplifyError || (result as EvaluateResultError).evaluateError;
                    let formattedError: string;
                    let errorPos = result.expr.length;
                    if (typeof error === "string") {
                        formattedError = String(error);
                    } else {
                        try {
                            formattedError = sprintf(jsclMsgs[error.messageCode], ...error.params);
                            errorPos = Number(error.position);
                        } catch (ignored) {
                            formattedError = String(error);
                        }
                    }
                    setResult(formattedError);
                    addHistoryItem([result.uid, result.expr, equalChar, formattedError, errorPos, false]);
                }
                break;
        }
    }, []);

    const startCalculation = useCallback((type: RequestType, historyOption?: CalcHistoryOption) => {
        const textArea = textAreaRef.current;
        const expr = textArea ? textArea.value : textAreaValueForRender.current;
        textAreaValueForRender.current = expr;
        if (workerBusy.current) {
            reInitWorker();
            workerBusy.current = false;
        }
        calcWithHistory.current = (historyOption === undefined) ? CalcHistoryOption.ADD_HISTORY : historyOption;
        if (expr) {
            if (!resultNotReady && lastCalculateType.current !== null && type === RequestType.EVALUATE) {
                textAreaValueForRender.current = result;
                if (textArea) textArea.value = result;
                moveCursor(MoveCursor.END);
                return;
            }
            setResultNotReady(true);
            setNeedReplaceResult(false);
            lastCalculateType.current = null;
            calcUid.current = (calcUid.current + 1) & 0xffffffff;
            const request: WorkerRequest = {
                type: type,
                uid: calcUid.current,
                expr: expr,
                angleUnit: angleUnit,
                numeralBase: numeralBase,
            };
            workerBusy.current = true;
            workerRef.current!.postMessage(request);
        } else {
            setResultNotReady(false);
            setNeedReplaceResult(false);
            setResult("");
        }
    }, [angleUnit, numeralBase]);

    const handleTextChange = useCallback(() => startCalculation(RequestType.EVALUATE_OR_SIMPLIFY, needReplaceResult ? CalcHistoryOption.REPLACE_HISTORY : CalcHistoryOption.ADD_HISTORY), [startCalculation, needReplaceResult]);

    const insertString = useCallback((str: string, off?: number) => {
        if (workerRef.current === null) return;
        const textArea = textAreaRef.current!;
        const currentValue = textArea.value;
        const newValue = currentValue.substring(0, lastCursorPos.current) + str + currentValue.substring(lastCursorPos.current, currentValue.length);
        if (newValue !== currentValue) {
            const newCursorPos = lastCursorPos.current + str.length + (off || 0);
            textArea.value = newValue;
            lastCursorPos.current = textArea.selectionStart = textArea.selectionEnd = newCursorPos;
        }
        textArea.focus();
        handleTextChange();
    }, [handleTextChange]);
    const insertFun = useCallback((fun: string) => {
        switch (fun) {
            case "∫":
            case "∂":
                insertString(fun + "(,x)", -3);
                break;
            case "Σ":
            case "∏":
                insertString(fun + "(,i,a,b)", -7);
                break;
            case "∫ab":
                insertString("∫ab(,x,a,b)", -7);
                break;
            case "mod":
            case "log":
                insertString(fun + "(,)", -2);
                break;
            case "x!":
            case "x%":
            case "x°":
            case "x!!":
                insertString(fun.substring(1));
                break;
            default:
                insertString(fun + "()", -1);
                break;
        }
    }, [insertString]);
    const moveCursor = useCallback((mv: MoveCursor) => {
        const textArea = textAreaRef.current!;
        const valueLen = textArea.value.length;
        let cursorPos = lastCursorPos.current;
        switch (mv) {
            case MoveCursor.LEFT:
                cursorPos = max(0, cursorPos - 1);
                break;
            case MoveCursor.RIGHT:
                cursorPos = min(cursorPos + 1, valueLen);
                break;
            case MoveCursor.START:
                cursorPos = 0;
                break;
            case MoveCursor.END:
                cursorPos = valueLen;
                break;
        }
        lastCursorPos.current = textArea.selectionStart = textArea.selectionEnd = cursorPos;
        textArea.focus();
    }, []);
    const onBracketPair = useCallback((withSpace: boolean) => {
        if (!withSpace) {
            insertString("()", -1);
        } else {
            // TODO unimplemented
            insertString("()", -1);
        }
    }, [insertString]);
    const erase = useCallback(() => {
        const textArea = textAreaRef.current!;
        const currentValue = textArea.value;
        let cursorPos = lastCursorPos.current;
        if (cursorPos > 0) {
            const newValue = currentValue.substring(0, cursorPos - 1) + currentValue.substring(cursorPos, currentValue.length);
            textArea.value = newValue;
            cursorPos--;
            lastCursorPos.current = textArea.selectionStart = textArea.selectionEnd = cursorPos;
        }
        textArea.focus();
        handleTextChange();
    }, [handleTextChange]);
    const clear = useCallback(() => {
        const textArea = textAreaRef.current!;
        textArea.value = textAreaValueForRender.current = "";
        lastCursorPos.current = textArea.selectionStart = textArea.selectionEnd = 0;
        textArea.focus();
        handleTextChange();
    }, [handleTextChange]);

    const calculate = useCallback(() => {
        if (lastCalculateType.current !== null && !resultNotReady) {
            const textArea = textAreaRef.current!;
            textArea.value = textAreaValueForRender.current = result;
            textArea.selectionStart = textArea.selectionEnd = lastCursorPos.current = result.length;
            textArea.focus();
        } else {
            startCalculation(RequestType.EVALUATE, CalcHistoryOption.REPLACE_HISTORY);
        }
    }, [startCalculation, resultNotReady]);

    const simplify = useCallback(() => startCalculation(RequestType.SIMPLIFY, CalcHistoryOption.REPLACE_HISTORY), [startCalculation]);

    const enterHistory = useCallback((item: HistoryItem) => {
        textAreaValueForRender.current = item[1];
        if (textAreaRef.current) textAreaRef.current.value = textAreaValueForRender.current;
        lastCursorPos.current = item[4] + 1;
        setResult(item[3]);
        setResultNotReady(item[5]);
        setNeedReplaceResult(false);
        setPage(Page.MAIN);
    }, []);

    const clearHistory = useCallback(() => {
        historyItems.length = 0;
        setPage(Page.MAIN);
    }, []);

    const undo = useCallback(() => {
        if (historyPtr.current > 0) {
            const newPtr = --historyPtr.current;
            enterHistory(historyItems[newPtr]);
        }
    }, []);

    const redo = useCallback(() => {
        if (historyPtr.current < historyItems.length - 1) {
            const newPtr = ++historyPtr.current;
            enterHistory(historyItems[newPtr]);
        }
    }, []);

    const aboutClick = useCallback(() => {
        open(GITHUB_URL, "_blank");
    }, []);

    const onSelectVar = useCallback((variable: string) => {
        variableToEnter.current = variable;
        setPage(Page.MAIN);
    }, []);

    const onSelectFun = useCallback((fun: string) => {
        functionToEnter.current = fun;
        setPage(Page.MAIN);
    }, []);

    const backToCalculator = useCallback(() => setPage(Page.MAIN), []);

    useEffect(() => {
        if (textAreaRef.current && textAreaRef.current.value && lastCalculateType.current) {
            startCalculation(lastCalculateType.current, CalcHistoryOption.REPLACE_HISTORY);
        }
    }, [angleUnit, numeralBase, startCalculation]);

    useEffect(() => {
        document.addEventListener("selectionchange", onSelectionChange);
        return () => {
            document.removeEventListener("selectionchange", onSelectionChange);
        };
    }, []);

    const calculatorProps: CalculatorProps = {
        editor: (
            <CalculatorEditor
                readonly={workerRef.current === null}
                textRef={setTextRef}
                defaultValue={textAreaValueForRender.current}
                value={workerLoadError !== null ? "Error: " + workerLoadError : undefined}
                textOnBlur={useCallback(() => { textAreaHasFocus.current = false }, [])}
                textOnFocus={useCallback(() => { textAreaHasFocus.current = true }, [])}
                textOnInput={handleTextChange}
                angleUnit={angleUnit}
                numeralBase={numeralBase}
                setAngleUnit={setAngleUnit}
                setNumeralBase={setNumeralBase}
                openHistoryPage={useCallback(() => setPage(Page.HISTORY), [setPage])}
                onAbout={aboutClick} />
        ),
        result: (
            <CalculatorResult
                textRef={resultTextRef}
                value={(workerRef.current === null && workerLoadError === null) ? "Loading..." : result}
                opacity={resultNotReady ? 0.5 : 1} />),
        buttonTextSize: fontSize,
        onNum: insertString,
        onPoint: useCallback(() => insertString("."), [insertString]),
        onOp: insertString,
        onVar: insertString,
        onFun: insertFun,
        onEqual: calculate,
        onSimplify: simplify,
        onErase: erase,
        onClear: clear,
        onBracket: insertString,
        onBracketPair: onBracketPair,
        onMoveCursor: moveCursor,
        onCopy: useCallback(() => copyText(result), [result]),
        onFavorite: aboutClick,
        onHistory: useCallback(() => { setNeedReplaceResult(false); setPage(Page.HISTORY) }, [setPage]),
        onUndo: undo,
        onRedo: redo,
        onChooseVar: useCallback(() => setPage(Page.SELECT_VARIABLE), [setPage]),
        onChooseFun: useCallback(() => setPage(Page.SELECT_FUNCTION), [setPage]),
    };

    switch (page) {
        case Page.HISTORY:
            return <CalculatorHistory
                historyItems={historyItems}
                enterHistory={enterHistory}
                clearHistory={clearHistory}
                exit={backToCalculator} />;
        case Page.SELECT_VARIABLE:
            return <CalculatorVariableSelect
                onVar={onSelectVar}
                exit={backToCalculator} />;
        case Page.SELECT_FUNCTION:
            return <CalculatorFunctionSelect
                onFun={onSelectFun}
                exit={backToCalculator} />;
    }

    return createElement(landscape ? CalculatorLandscape : CalculatorPortrait, calculatorProps);
};

export default function CalculatorApp() {
    const [currentPage, setCurrentPage] = useState<Page>(Page.WIZARD);
    const darkMode = useMediaQuery("(prefers-color-scheme:dark)");
    const theme = darkMode ? themeDark : themeLight;
    const [buttonSize, fontSize, landscape, setContainer] = useCalculatorSize();
    const onWorkerMessageRef = useRef<((e: MessageEvent<WorkerResult>) => void) | undefined>(undefined);
    const onWorkerErrorRef = useRef<((e: ErrorEvent) => void) | undefined>(undefined);
    const workerState = useWorker(onWorkerMessageRef, onWorkerErrorRef);
    const historyItems: HistoryItem[] = useMemo(() => [], []);

    let component: ReactElement | undefined;
    switch (currentPage) {
        case Page.WIZARD:
            component = <AppWizard
                buttonSize={buttonSize}
                fontSize={fontSize}
                setPage={setCurrentPage} />;
            break;
        case Page.MAIN:
        case Page.HISTORY:
        case Page.SELECT_VARIABLE:
        case Page.SELECT_FUNCTION:
            component = <Calculator
                landscape={landscape}
                fontSize={fontSize}
                workerState={workerState}
                workerMessageRef={onWorkerMessageRef}
                historyItems={historyItems}
                page={currentPage}
                setPage={setCurrentPage} />;
            break;
    }
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <FilledBox ref={setContainer} sx={bgSx}>{component}</FilledBox>
        </ThemeProvider>
    );
}
