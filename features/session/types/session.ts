import type { CaptureResult } from "@/features/capture/types/capture";
import type { CapturedPhoto } from "@/features/session/hooks/useSession";

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
  setCaptureResult: (result: CaptureResult | null) => void;
  capturedPhotos: CapturedPhoto[];
  captureResult: CaptureResult | null;
}