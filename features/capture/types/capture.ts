export type CaptureStatus = "idle" | "capturing" | "success" | "error";

export interface CaptureError {
  code: "capture-in-progress" | "unknown";
  message: string;
}

export type CaptureResult =
  | {
      success: true;
      blob: Blob;
      width: number;
      height: number;
      error: null;
    }
  | {
      success: false;
      blob: null;
      width: number;
      height: number;
      error: CaptureError;
    };

export interface CaptureContext {
  status: CaptureStatus;
  capture: (video: HTMLVideoElement) => Promise<CaptureResult>;
  reset: () => void;
}
