import type { CaptureResult } from "@/features/capture/types/capture";

export type SessionState =
  | "WELCOME"
  | "CAMERA_PERMISSION"
  | "CAMERA_PREVIEW"
  | "COUNTDOWN"
  | "CAPTURE"
  | "FRAME_EDITOR"
  | "DOWNLOAD"
  | "FINISH";

export interface SessionContext {
  currentState: SessionState;
  goTo: (state: SessionState) => void;
  reset: () => void;
  setCaptureResult: (result: CaptureResult) => void;
  captureResult: CaptureResult | null;
}
