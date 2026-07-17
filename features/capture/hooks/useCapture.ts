"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CAPTURE_CONFIG } from "@/features/capture/config/captureConfig";
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

export const captureCount = CAPTURE_CONFIG.captureCount;

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
        let lastResult: CaptureResult = {
          success: false,
          blob: null,
          width: 0,
          height: 0,
          error: {
            code: "unknown",
            message: "Unable to capture image.",
          },
        };

        // Capture sequence foundation. Iteration count is sourced from
        // CAPTURE_CONFIG.captureCount so the loop config is centralised, but it
        // is currently forced to a single iteration so behavior matches the
        // original single-capture flow.
        const configuredCount = CAPTURE_CONFIG.captureCount;
        const iterations = Math.min(1, Math.max(0, configuredCount));
        for (let index = 0; index < iterations; index += 1) {
          try {
            const canvas = captureVideoFrame(video);
            const blob = await canvasToBlob(canvas);
            lastResult = {
              success: true,
              blob,
              width: canvas.width,
              height: canvas.height,
              error: null,
            };
          } catch (error) {
            lastResult = {
              success: false,
              blob: null,
              width: 0,
              height: 0,
              error: createCaptureError("unknown", error),
            };
            break;
          }
        }

        if (
          isMountedRef.current &&
          operationId === operationIdRef.current &&
          lastResult.success
        ) {
          setStatus("success");
        } else if (
          isMountedRef.current &&
          operationId === operationIdRef.current
        ) {
          setStatus("error");
        }

        return lastResult;
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