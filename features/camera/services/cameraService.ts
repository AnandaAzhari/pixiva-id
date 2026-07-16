import type {
  CameraConstraints,
  CameraDevice,
  CameraError,
  CameraPermission,
} from "@/features/camera/types/camera";

export type CameraServiceResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: CameraError;
    };

const CAMERA_ERROR_MESSAGES: Record<CameraError["code"], string> = {
  "permission-denied": "Camera access was denied. Please allow camera access and try again.",
  "device-not-found": "No camera was found on this device.",
  "device-unavailable": "The camera is unavailable. Close other apps using it and try again.",
  "constraints-not-supported": "The selected camera settings are not supported.",
  unsupported: "Camera access is not supported by this browser.",
  unknown: "Unable to access the camera. Please try again.",
};

function getMediaDevices(): MediaDevices | null {
  if (typeof navigator === "undefined") {
    return null;
  }

  return navigator.mediaDevices ?? null;
}

function createCameraError(code: CameraError["code"]): CameraError {
  return {
    code,
    message: CAMERA_ERROR_MESSAGES[code],
  };
}

function getBrowserErrorName(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("name" in error)) {
    return null;
  }

  return typeof error.name === "string" ? error.name : null;
}

function toMediaStreamConstraints(
  constraints: CameraConstraints,
): MediaStreamConstraints {
  const video: MediaTrackConstraints = {};

  if (constraints.deviceId !== undefined) {
    video.deviceId = { exact: constraints.deviceId };
  }

  if (constraints.facing !== undefined) {
    video.facingMode = { ideal: constraints.facing };
  }

  if (constraints.width !== undefined) {
    video.width = { ideal: constraints.width };
  }

  if (constraints.height !== undefined) {
    video.height = { ideal: constraints.height };
  }

  if (constraints.aspectRatio !== undefined) {
    video.aspectRatio = { ideal: constraints.aspectRatio };
  }

  if (constraints.frameRate !== undefined) {
    video.frameRate = { ideal: constraints.frameRate };
  }

  return {
    audio: false,
    video,
  };
}

function toCameraPermission(permission: PermissionState): CameraPermission {
  switch (permission) {
    case "granted":
    case "denied":
    case "prompt":
      return permission;
    default:
      return "unknown";
  }
}

function toCameraDevice(device: MediaDeviceInfo): CameraDevice {
  return {
    id: device.deviceId,
    label: device.label,
    facing: null,
  };
}

export function isCameraSupported(): boolean {
  const mediaDevices = getMediaDevices();

  return mediaDevices !== null && typeof mediaDevices.getUserMedia === "function";
}

export async function getCameraPermission(): Promise<CameraPermission> {
  if (typeof navigator === "undefined" || !("permissions" in navigator)) {
    return "unknown";
  }

  try {
    const permissionStatus = await navigator.permissions.query({ name: "camera" });

    return toCameraPermission(permissionStatus.state);
  } catch {
    return "unknown";
  }
}

export async function getAvailableVideoDevices(): Promise<
  CameraServiceResult<CameraDevice[]>
> {
  const mediaDevices = getMediaDevices();

  if (mediaDevices === null || typeof mediaDevices.enumerateDevices !== "function") {
    return {
      success: false,
      error: createCameraError("unsupported"),
    };
  }

  try {
    const devices = await mediaDevices.enumerateDevices();

    return {
      success: true,
      data: devices
        .filter((device) => device.kind === "videoinput")
        .map(toCameraDevice),
    };
  } catch (error) {
    return {
      success: false,
      error: toCameraError(error),
    };
  }
}

export async function openCameraStream(
  constraints: CameraConstraints = {},
): Promise<CameraServiceResult<MediaStream>> {
  const mediaDevices = getMediaDevices();

  if (mediaDevices === null || typeof mediaDevices.getUserMedia !== "function") {
    return {
      success: false,
      error: createCameraError("unsupported"),
    };
  }

  try {
    const stream = await mediaDevices.getUserMedia(
      toMediaStreamConstraints(constraints),
    );

    return {
      success: true,
      data: stream,
    };
  } catch (error) {
    return {
      success: false,
      error: toCameraError(error),
    };
  }
}

export async function requestCameraAccess(
  constraints: CameraConstraints = {},
): Promise<CameraServiceResult<MediaStream>> {
  return openCameraStream(constraints);
}

export function stopCameraStream(stream: MediaStream | null | undefined): void {
  if (stream === null || stream === undefined) {
    return;
  }

  try {
    for (const track of stream.getTracks()) {
      try {
        track.stop();
      } catch {
        // A browser may have already stopped this track.
      }
    }
  } catch {
    // A browser may invalidate a stream while it is being released.
  }
}

export function releaseCameraResources(
  ...streams: Array<MediaStream | null | undefined>
): void {
  for (const stream of streams) {
    stopCameraStream(stream);
  }
}

export function toCameraError(error: unknown): CameraError {
  switch (getBrowserErrorName(error)) {
    case "NotAllowedError":
    case "SecurityError":
      return createCameraError("permission-denied");
    case "NotFoundError":
    case "DevicesNotFoundError":
      return createCameraError("device-not-found");
    case "NotReadableError":
    case "TrackStartError":
    case "AbortError":
      return createCameraError("device-unavailable");
    case "OverconstrainedError":
    case "ConstraintNotSatisfiedError":
      return createCameraError("constraints-not-supported");
    case "TypeError":
      return createCameraError("unsupported");
    default:
      return createCameraError("unknown");
  }
}
