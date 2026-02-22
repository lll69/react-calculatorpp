import { MutableRefObject, RefObject, useEffect, useRef, useState } from "react";
import { WorkerResult } from "./worker_types";
import { USE_INLINED_WORKER_CODE } from "./build_config";

const createObjectURL = URL.createObjectURL;

export type WorkerState = [MutableRefObject<Worker | null>, any, () => Worker];

export function useWorker(
    onWorkerMessage: RefObject<((e: MessageEvent<WorkerResult>) => void) | undefined>,
    onWorkerError: RefObject<((e: ErrorEvent) => void) | undefined>
): [MutableRefObject<Worker | null>, any, () => Worker] {
    const workerJs = useRef<string | null>(null);
    const workerRef = useRef<Worker | null>(null);
    const setWorker = useState<Worker | null>(null)[1];
    const [error, setError] = useState<string | null>(null);

    const reInitWorker = () => {
        if (workerRef.current) workerRef.current.terminate();
        const newWorker = new Worker(createObjectURL(new Blob([workerJs.current!], { type: "text/javascript" })));
        newWorker.onmessage = (e => { if (onWorkerMessage.current) onWorkerMessage.current(e) });
        newWorker.onerror = (e => { if (onWorkerError.current) onWorkerError.current(e) });
        setWorker(workerRef.current = newWorker);
        return newWorker;
    };

    useEffect(() => {
        async function loadWorker() {
            if (USE_INLINED_WORKER_CODE) {
                try {
                    const workerCode = "```&INLINED_WORKER_CODE&```";
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
    ];
}
