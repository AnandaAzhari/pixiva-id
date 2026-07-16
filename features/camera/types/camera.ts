export type CameraStatus =
  | "idle"
  | "requesting-permission"
  | "ready"
  | "streaming"
  | "error";

export type CameraFacing = "user" | "environment";

export type CameraPermission = "unknown" | "prompt" | "granted" | "denied";

export interface CameraError {
  code:
    | "permission-denied"
    | "device-not-found"
    | "device-unavailable"
    | "constraints-not-supported"
    | "unsupported"
    | "unknown";
  message: string;
}

export interface CameraDevice {
  id: string;
  label: string;
  facing: CameraFacing | null;
}

export interface CameraConstraints {
  deviceId?: string;
  facing?: CameraFacing;
  width?: number;
  height?: number;
  aspectRatio?: number;
  frameRate?: number;
}

export interface CameraState {
  status: CameraStatus;
  permission: CameraPermission;
  devices: CameraDevice[];
  selectedDeviceId: string | null;
  constraints: CameraConstraints;
  error: CameraError | null;
}

export type CameraResult =
  | {
      success: true;
      state: CameraState;
    }
  | {
      success: false;
      error: CameraError;
    };
