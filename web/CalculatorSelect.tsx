import { AppBar, Container, IconButton, List, ListItem, ListItemButton, ListItemText, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { bgSx, ScrollableFilledBox } from "./CalculatorStyled";
import { msgs, S } from "./CalculatorL10n";
import { ArrowBack } from "@mui/icons-material";
import { useCallback, useMemo, useState } from "react";

const VARIABLES = {
    "π": S.c_var_description_pi,
    "e": S.c_var_description_e,
    "i": S.c_var_description_i,
    "c": S.c_var_description_c,
    "G": S.c_var_description_G,
    "h": S.c_var_description_h_reduced,
};

const MathPI = 3.14159265358979323846;
const VARIABLE_VALUES = {
    "π": MathPI,
    "e": 2.7182818284590452354,
    "i": "√(-1)",
    "c": 299792458,
    "G": "6.673848E-11",
    "h": String(6.6260695729E-34 / (2 * MathPI)).replace("e", "E"),
};

const FUNCTION_DESC = {
    "sin": S.c_fun_description_sin,
    "cos": S.c_fun_description_cos,
    "tan": S.c_fun_description_tan,
    "cot": S.c_fun_description_cot,
    "asin": S.c_fun_description_asin,
    "acos": S.c_fun_description_acos,
    "atan": S.c_fun_description_atan,
    "acot": S.c_fun_description_acot,
    "ln": S.c_fun_description_ln,
    "lg": S.c_fun_description_lg,
    "log": S.c_fun_description_log,
    "exp": S.c_fun_description_exp,
    "√": S.c_fun_description_sqrt,
    "sqrt": S.c_fun_description_sqrt,
    "cubic": S.c_fun_description_cubic,
    "abs": S.c_fun_description_abs,
    "sgn": S.c_fun_description_sgn,
    "eq": S.c_fun_description_eq,
    "le": S.c_fun_description_le,
    "ge": S.c_fun_description_ge,
    "ne": S.c_fun_description_ne,
    "lt": S.c_fun_description_lt,
    "gt": S.c_fun_description_gt,
    "rad": S.c_fun_description_rad,
    "dms": S.c_fun_description_dms,
    "deg": S.c_fun_description_deg,
    "x%": S.c_pf_description_percent,
    "x!": S.c_pf_description_factorial,
    "x!!": S.c_pf_description_double_factorial,
    "x°": S.c_pf_description_degree,
    "mod": S.c_op_description_mod,
    "Σ": S.c_op_description_sum,
    "∏": S.c_op_description_product,
    "∂": S.c_op_description_derivative,
    "∫ab": S.c_op_description_integral_ab,
    "∫": S.c_op_description_integral,
};

const FUNCTION_ARGS = {
    "dms": "(d, m, s)",
    "log": "(base, x)",
    "rad": "(x, y, z)",
    "√n": "(x, n)",
    "ap": "(x, y)",
    "eq": "(x, y)",
    "ge": "(x, y)",
    "gt": "(x, y)",
    "le": "(x, y)",
    "lt": "(x, y)",
    "ne": "(x, y)",
    "x!": "",
    "x!!": "",
    "x%": "",
    "mod": "(x, y)",
    "x°": "",
    "∂": "(f(x), x, x_point, order)",
    "∫": "(f(x), x)",
    "∫ab": "(f(x), x, a, b)",
    "Σ": "(f(i), i, from, to)",
    "∏": "(f(i), i, from, to)",
}

const FUNCTIONS_COMMON = [
    "abs",
    "conjugate",
    "cubic",
    "deg",
    "dms",
    "exp",
    "im",
    "lg",
    "ln",
    "log",
    "rad",
    "re",
    "sgn",
    "√",
    "√3",
    "√4",
    "√n",
];

const FUNCTIONS_TRIG = [
    "sin",
    "cos",
    "tan",
    "cot",
    "asin",
    "acos",
    "atan",
    "acot",
];

const FUNCTIONS_CMP = [
    "ap",
    "eq",
    "ge",
    "gt",
    "le",
    "lt",
    "ne",
];

const FUNCTIONS_HYP = [
    "sinh",
    "cosh",
    "tanh",
    "coth",
    "asinh",
    "acosh",
    "atanh",
    "acoth",
];

const FUNCTIONS_OPS = [
    "x!",
    "x!!",
    "x%",
    "mod",
    "x°",
];

const FUNCTIONS_DERIVATIVE = [
    "∂",
    "∫",
    "∫ab",
];

const FUNCTIONS_OTHER = [
    "Σ",
    "∏",
];

const FUNCTION_CATEGORIES = {
    [S.c_fun_category_common]: FUNCTIONS_COMMON,
    [S.c_fun_category_trig]: FUNCTIONS_TRIG,
    [S.c_fun_category_comparison]: FUNCTIONS_CMP,
    [S.c_fun_category_hyper_trig]: FUNCTIONS_HYP,
    [S.c_operators]: FUNCTIONS_OPS,
    [S.derivatives]: FUNCTIONS_DERIVATIVE,
    [S.other]: FUNCTIONS_OTHER,
};

const FUNCTION_CATEGORY_ARRAY = [
    S.c_fun_category_common,
    S.c_fun_category_trig,
    S.c_fun_category_comparison,
    S.c_fun_category_hyper_trig,
    S.c_operators,
    S.derivatives,
    S.other,
];

let functionPage = 0;

export function CalculatorVariableSelect({ onVar, exit }: { onVar: (variable: string) => void, exit: () => void }) {
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
                        {msgs[S.cpp_vars_and_constants]}
                    </Typography>
                </Toolbar>
            </AppBar>
            <ScrollableFilledBox>
                <Container sx={bgSx}>
                    <List>
                        <Toolbar />
                        {Object.keys(VARIABLES).map(name => (
                            <ListItem key={name} disablePadding>
                                <ListItemButton onClick={useCallback(() => onVar(name), [onVar])}>
                                    <ListItemText primary={name + " = " + VARIABLE_VALUES[name]} secondary={msgs[VARIABLES[name]]} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Container>
            </ScrollableFilledBox>
        </>
    )
};

export function CalculatorFunctionSelect({ onFun, exit }: { onFun: (fun: string) => void, exit: () => void }) {
    const [currentPage, setCurrentPage] = useState(functionPage);
    const onFunMap = useMemo(() => ({}), []);
    const mapOnFun = (fun: string) => {
        let result: (() => void) = onFunMap[fun];
        if (!result) {
            result = () => onFun(fun);
            onFunMap[fun] = result;
        }
        return result;
    };
    functionPage = currentPage;
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
                        {msgs[S.c_functions]}
                    </Typography>
                </Toolbar>
                <Tabs
                    value={currentPage}
                    onChange={useCallback((_, newPage: number) => setCurrentPage(newPage), [])}
                    variant="scrollable"
                    indicatorColor="secondary"
                    textColor="inherit"
                    scrollButtons="auto"
                    allowScrollButtonsMobile>
                    {FUNCTION_CATEGORY_ARRAY.map((res: number) => (
                        <Tab key={res} label={msgs[res]} />
                    ))}
                </Tabs>
            </AppBar>
            <ScrollableFilledBox>
                <Container sx={bgSx}>
                    <List>
                        <Toolbar />
                        <Tabs />
                        {FUNCTION_CATEGORIES[FUNCTION_CATEGORY_ARRAY[currentPage]].map((fun: string) => (
                            <ListItem key={fun} disablePadding>
                                <ListItemButton onClick={mapOnFun(fun)}>
                                    <ListItemText
                                        primary={fun + (FUNCTION_ARGS[fun] === undefined ? "(x)" : FUNCTION_ARGS[fun])}
                                        secondary={FUNCTION_DESC[fun] ? msgs[FUNCTION_DESC[fun]] : null} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Container>
            </ScrollableFilledBox>
        </>
    )
};
