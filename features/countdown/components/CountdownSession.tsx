"use client";

import { useEffect, useRef } from "react";

import { CountdownOverlay } from "@/features/countdown/components/CountdownOverlay";
import { useCountdown } from "@/features/countdown/hooks/useCountdown";

interface CountdownSessionProps {
  onFinished: () => void;
}

export function CountdownSession({ onFinished }: CountdownSessionProps) {
  const { currentNumber, start, status } = useCountdown();
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (status === "finished" && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      onFinished();
    }
  }, [onFinished, status]);

  return (
    <CountdownOverlay
      currentNumber={currentNumber}
      visible={status === "running"}
    />
  );
}
