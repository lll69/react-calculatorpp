import { readFileSync, writeFileSync } from "node:fs";
// Change USE_INLINED_WORKER_CODE to true in web/build_config.ts first

const INLINED_REPLACER = "\"```&INLINED_WORKER_CODE&```\"";

let calcHtml = readFileSync("dist/calc.html", { encoding: "utf-8" });
let calcJs = readFileSync("dist/calc.js", { encoding: "utf-8" });
let workerJs = readFileSync("dist/cpp_worker.js", { encoding: "utf-8" });
if (calcJs.indexOf(INLINED_REPLACER) >= 0) {
    workerJs = JSON.stringify(workerJs);
    calcJs = calcJs.replaceAll("\"```&INLINED_WORKER_CODE&```\"", () => workerJs);
} else {
    function bytesToBase64(bytes: Uint8Array) {
        const binString = Array.from(bytes, (byte) =>
            String.fromCodePoint(byte),
        ).join("");
        return btoa(binString);
    }
    const base64 = "data:text/javascript;base64," + bytesToBase64(new TextEncoder().encode(workerJs));
    calcJs = calcJs.replaceAll("cpp_worker.js", () => base64);
}
writeFileSync("dist/calc_bundled.js", calcJs, { encoding: "utf-8" });
calcHtml = calcHtml.replaceAll("<script src=\"calc.js\"></script>", () => ("<script>" + calcJs + "</script>"));
writeFileSync("dist/calc_bundled.html", calcHtml, { encoding: "utf-8" });
console.log("Written", calcHtml.length, "chars");

export { };
