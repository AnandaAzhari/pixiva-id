export type CountdownStatus = "idle" | "running" | "finished";

export interface CountdownContext {
  status: CountdownStatus;
  currentNumber: number;
  duration: number;
  start: () => void;
  reset: () => void;
}
