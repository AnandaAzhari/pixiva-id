"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  CountdownContext,
  CountdownStatus,
} from "@/features/countdown/types/countdown";

const DEFAULT_COUNTDOWN_DURATION = 3;
const COUNTDOWN_INTERVAL_MS = 1_000;

export function useCountdown(
  duration: number = DEFAULT_COUNTDOWN_DURATION,
): CountdownContext {
  const [status, setStatus] = useState<CountdownStatus>("idle");
  const [currentNumber, setCurrentNumber] = useState(duration);
  const isMountedRef = useRef(false);
  const isRunningRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimeoutRef = useCallback((): void => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const reset = useCallback((): void => {
    clearTimeoutRef();
    isRunningRef.current = false;
    setCurrentNumber(duration);
    setStatus("idle");
  }, [clearTimeoutRef, duration]);

  const start = useCallback((): void => {
    if (isRunningRef.current) {
      return;
    }

    isRunningRef.current = true;
    setCurrentNumber(duration);
    setStatus("running");

    function tick(currentValue: number): void {
      timeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current || !isRunningRef.current) {
          return;
        }

        const nextValue = Math.max(currentValue - 1, 0);
        setCurrentNumber(nextValue);

        if (nextValue === 0) {
          isRunningRef.current = false;
          timeoutRef.current = null;
          setStatus("finished");
          return;
        }

        tick(nextValue);
      }, COUNTDOWN_INTERVAL_MS);
    }

    if (duration === 0) {
      isRunningRef.current = false;
      setStatus("finished");
      return;
    }

    tick(duration);
  }, [duration]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      isRunningRef.current = false;
      clearTimeoutRef();
    };
  }, [clearTimeoutRef]);

  return { status, currentNumber, duration, start, reset };
}
