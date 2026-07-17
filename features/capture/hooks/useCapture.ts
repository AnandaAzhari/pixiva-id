"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  canvasToBlob,
  captureVideoFrame,
} from "@/features/capture/services/captureService";
import type {
  CaptureContext,
  CaptureError,
  CaptureResult,
  CaptureStatus,
} from "@/features/capture/types/capture";

function createCaptureError(
  code: CaptureError["code"],
  error: unknown,
): CaptureError {
  return {
    code,
    message: error instanceof Error ? error.message : "Unable to capture image.",
  };
}

export function useCapture(): CaptureContext {
  const [status, setStatus] = useState<CaptureStatus>("idle");
  const isCapturingRef = useRef(false);
  const isMountedRef = useRef(false);
  const operationIdRef = useRef(0);

  const reset = useCallback((): void => {
    operationIdRef.current += 1;
    isCapturingRef.current = false;
    setStatus("idle");
  }, []);

  const capture = useCallback(
    async (video: HTMLVideoElement): Promise<CaptureResult> => {
      if (isCapturingRef.current) {
        return {
          success: false,
          blob: null,
          width: 0,
          height: 0,
          error: {
            code: "capture-in-progress",
            message: "A capture is already in progress.",
          },
        };
      }

      const operationId = ++operationIdRef.current;
      isCapturingRef.current = true;
      setStatus("capturing");

      try {
        const canvas = captureVideoFrame(video);
        const blob = await canvasToBlob(canvas);
        const result: CaptureResult = {
          success: true,
          blob,
          width: canvas.width,
          height: canvas.height,
          error: null,
        };

        if (isMountedRef.current && operationId === operationIdRef.current) {
          setStatus("success");
        }

        return result;
      } catch (error) {
        const result: CaptureResult = {
          success: false,
          blob: null,
          width: 0,
          height: 0,
          error: createCaptureError("unknown", error),
        };

        if (isMountedRef.current && operationId === operationIdRef.current) {
          setStatus("error");
        }

        return result;
      } finally {
        if (operationId === operationIdRef.current) {
          isCapturingRef.current = false;
        }
      }
    },
    [],
  );

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      isCapturingRef.current = false;
      operationIdRef.current += 1;
    };
  }, []);

  return { status, capture, reset };
}
