import { renderToString } from 'react-dom/server';
import CalculatorApp from './CalculatorApp';
import { Backdrop, CircularProgress, styled } from '@mui/material';

const AlwaysShowBackdrop = styled(Backdrop)({
    opacity: "1 !important",
    backdropFilter: "blur(4px)",
});

const result: string[][] = [];

function renderCalculatorApp() {
    const html = "<!DOCTYPE html>\n" + renderToString(
        <html>
            <head>
                <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
                <title>Calculator++</title>
                <meta name="viewport" content="width=device-width" />
                <style>{"body{background-color:#f5f5f5}@media(prefers-color-scheme:dark){body{background-color:#101010}}html,body{margin:0;width:100%;height:100%}#root{width:100%;height:100%}"}</style>
            </head>

            <body>
                <div id="root">
                    <CalculatorApp />
                    <AlwaysShowBackdrop
                        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open>
                        <CircularProgress color="inherit" />
                    </AlwaysShowBackdrop>
                </div>
                <script src="calc.js"></script>
            </body>
        </html>
    );
    result.push(["calc.html", html]);
}

function main() {
    renderCalculatorApp();
}

main();
console.log(JSON.stringify(result));
