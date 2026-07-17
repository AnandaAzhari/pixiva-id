"use client";

import { useCallback, useState } from "react";

import type { CaptureResult } from "@/features/capture/types/capture";
import type { SessionContext, SessionState } from "@/features/session/types/session";

const INITIAL_SESSION_STATE: SessionState = "WELCOME";

export function useSession(): SessionContext {
  const [currentState, setCurrentState] = useState<SessionState>(
    INITIAL_SESSION_STATE,
  );
  const [captureResult, setCaptureResultState] = useState<CaptureResult | null>(
    null,
  );

  const goTo = useCallback((state: SessionState): void => {
    setCurrentState(state);
  }, []);

  const reset = useCallback((): void => {
    setCurrentState(INITIAL_SESSION_STATE);
    setCaptureResultState(null);
  }, []);

  const setCaptureResult = useCallback(
    (result: CaptureResult | null): void => {
      setCaptureResultState(result);
    },
    [],
  );

  return { currentState, goTo, reset, setCaptureResult, captureResult };
}
