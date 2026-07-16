"use client";

import { useCallback, useState } from "react";

import type { SessionContext, SessionState } from "@/features/session/types/session";

const INITIAL_SESSION_STATE: SessionState = "WELCOME";

export function useSession(): SessionContext {
  const [currentState, setCurrentState] = useState<SessionState>(
    INITIAL_SESSION_STATE,
  );

  const goTo = useCallback((state: SessionState): void => {
    setCurrentState(state);
  }, []);

  const reset = useCallback((): void => {
    setCurrentState(INITIAL_SESSION_STATE);
  }, []);

  return { currentState, goTo, reset };
}
