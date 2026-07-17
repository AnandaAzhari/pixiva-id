"use client";

import { useCallback, useEffect, useRef } from "react";

import { CameraPermission } from "@/features/camera/components/CameraPermission";
import { CameraPreview } from "@/features/camera/components/CameraPreview";
import { useCamera } from "@/features/camera/hooks/useCamera";
import { useCapture } from "@/features/capture/hooks/useCapture";
import { CountdownSession } from "@/features/countdown/components/CountdownSession";
import { WelcomeScreen } from "@/features/session/components/WelcomeScreen";
import { useSession } from "@/features/session/hooks/useSession";

export function SessionRoot() {
  const { capture: captureFrame } = useCapture();
  const { currentState, goTo, setCaptureResult } = useSession();
  const {
    devices,
    error,
    initializeCamera,
    isSupported,
    loading,
    permission,
    requestPermission,
    selectedDeviceId,
    startCamera,
    status,
    stream,
  } = useCamera();
  const hasInitializedCameraRef = useRef(false);
  const hasStartedCameraRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCountdownFinished = useCallback((): void => {
    const videoElement = videoRef.current;

    if (videoElement === null) {
      goTo("CAMERA_PREVIEW");
      return;
    }

    void captureFrame(videoElement).then((result) => {
      setCaptureResult(result);

      if (result.success) {
        goTo("FRAME_EDITOR");
        return;
      }

      goTo("CAMERA_PREVIEW");
    });
  }, [captureFrame, goTo, setCaptureResult]);

  useEffect(() => {
    if (currentState !== "CAMERA_PERMISSION" || hasInitializedCameraRef.current) {
      return;
    }

    hasInitializedCameraRef.current = true;
    void initializeCamera();
  }, [currentState, initializeCamera]);

  useEffect(() => {
    if (
      currentState !== "CAMERA_PERMISSION" ||
      permission !== "granted" ||
      stream !== null ||
      hasStartedCameraRef.current
    ) {
      return;
    }

    hasStartedCameraRef.current = true;
    void startCamera();
  }, [currentState, permission, startCamera, stream]);

  useEffect(() => {
    if (currentState === "CAMERA_PERMISSION" && stream !== null) {
      goTo("CAMERA_PREVIEW");
    }
  }, [currentState, goTo, stream]);

  if (currentState === "CAMERA_PERMISSION") {
    return (
      <CameraPermission
        error={error}
        isSupported={isSupported}
        loading={loading}
        onRequestPermission={requestPermission}
        onRetry={initializeCamera}
        permission={permission}
        status={status}
      />
    );
  }

  if (
    (currentState === "CAMERA_PREVIEW" || currentState === "COUNTDOWN") &&
    stream !== null
  ) {
    const selectedDevice = devices.find(
      (device) => device.id === selectedDeviceId,
    );

    return (
      <>
        <CameraPreview
          isFrontCamera={selectedDevice?.facing === "user"}
          onTakePhoto={() => goTo("COUNTDOWN")}
          stream={stream}
          videoRef={videoRef}
        />
        {currentState === "COUNTDOWN" && (
          <CountdownSession onFinished={handleCountdownFinished} />
        )}
      </>
    );
  }

  if (currentState === "CAPTURE") {
    return null;
  }

  if (currentState === "WELCOME") {
    return <WelcomeScreen onStart={() => goTo("CAMERA_PERMISSION")} />;
  }

  return null;
}
