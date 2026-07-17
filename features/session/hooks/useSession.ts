"use client";

import { useCallback, useState } from "react";

import type { CaptureResult } from "@/features/capture/types/capture";
import type { SessionContext, SessionState } from "@/features/session/types/session";

// Storage shape: a captured photo is the single successful capture result.
export type CapturedPhoto = Extract<CaptureResult, { success: true }>;

function asCapturedPhoto(result: CaptureResult | null): CapturedPhoto | null {
  if (result === null) {
    return null;
  }
  return result.success ? (result as CapturedPhoto) : null;
}

const INITIAL_SESSION_STATE: SessionState = "WELCOME";

export function useSession(): SessionContext {
  const [currentState, setCurrentState] = useState<SessionState>(
    INITIAL_SESSION_STATE,
  );
  // Storage is a single-element array; behavior keeps exactly one captured photo.
  const [capturedPhotos, setCapturedPhotosState] = useState<CapturedPhoto[]>([]);

  const goTo = useCallback((state: SessionState): void => {
    setCurrentState(state);
  }, []);

  const reset = useCallback((): void => {
    setCurrentState(INITIAL_SESSION_STATE);
    setCapturedPhotosState([]);
  }, []);

  const setCaptureResult = useCallback(
    (result: CaptureResult | null): void => {
      const photo = asCapturedPhoto(result);
      setCapturedPhotosState(photo === null ? [] : [photo]);
    },
    [],
  );

  return {
    captureResult: capturedPhotos[0] ?? null,
    capturedPhotos,
    currentState,
    goTo,
    reset,
    setCaptureResult,
  };
}