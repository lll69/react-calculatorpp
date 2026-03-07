import { MutableRefObject, RefObject, useEffect, useRef, useState } from "react";
import { RequestType, SetMemoryRequest, WorkerResult } from "./worker_types";
import { AngleUnit, NumeralBase } from "./CalculatorJscl";

const createObjectURL = URL.createObjectURL;
const revokeObjectURL = URL.revokeObjectURL;

export type WorkerState = [MutableRefObject<Worker | null>, any, (memory?: [string, AngleUnit, NumeralBase]) => Worker, (error: any) => void];

export function useWorker(
    onWorkerMessage: RefObject<((e: MessageEvent<WorkerResult>) => void) | undefined>,
    onWorkerError: RefObject<((e: ErrorEvent) => void) | undefined>
): WorkerState {
    const workerJs = useRef<string | null>(null);
    const workerRef = useRef<Worker | null>(null);
    const blobUrl = useRef<string | null>(null);
    const setWorker = useState<Worker | null>(null)[1];
    const [error, setError] = useState<string | null>(null);

    const reInitWorker = (memory?: [string, AngleUnit, NumeralBase]) => {
        if (workerRef.current) workerRef.current.terminate();
        if (blobUrl.current) revokeObjectURL(blobUrl.current);
        const newWorker = new Worker(blobUrl.current = createObjectURL(new Blob([workerJs.current!], { type: "text/javascript" })));
        newWorker.onmessage = (e => { if (onWorkerMessage.current) onWorkerMessage.current(e) });
        newWorker.onerror = (e => { if (onWorkerError.current) onWorkerError.current(e) });
        if (memory) newWorker.postMessage({
            type: RequestType.SET_MEMORY,
            uid: -1,
            expr: memory[0],
            angleUnit: memory[1],
            numeralBase: memory[2],
        } as SetMemoryRequest)
        setWorker(workerRef.current = newWorker);
        return newWorker;
    };

    useEffect(() => {
        async function loadWorker() {
            const workerCode = "```&INLINED_WORKER_CODE&```";
            if (workerCode.charCodeAt(0) !== "`".charCodeAt(0)) {
                try {
                    workerJs.current = workerCode;
                    reInitWorker();
                } catch (e) {
                    setError(e.message);
                }
            } else {
                try {
                    const response = await fetch("cpp_worker.js");
                    if (response.ok) {
                        const workerCode = await response.text();
                        workerJs.current = workerCode;
                        reInitWorker();
                    } else {
                        throw "fetch status=" + response.status;
                    }
                } catch (e) {
                    setError(e.message);
                }
            }
        }

        loadWorker();
        return () => {
            if (workerRef.current) workerRef.current.terminate();
        }
    }, []);

    return [
        workerRef,
        error,
        reInitWorker,
        setError,
    ];
}
