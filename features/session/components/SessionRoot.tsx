"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import { CameraPermission } from "@/features/camera/components/CameraPermission";
import { CameraPreview } from "@/features/camera/components/CameraPreview";
import { useCamera } from "@/features/camera/hooks/useCamera";
import { CaptureCanvas } from "@/features/capture/components/CaptureCanvas";
import { useCapture } from "@/features/capture/hooks/useCapture";
import { CountdownSession } from "@/features/countdown/components/CountdownSession";
import { WelcomeScreen } from "@/features/session/components/WelcomeScreen";
import { useSession } from "@/features/session/hooks/useSession";

export function SessionRoot() {
  const { capture: captureFrame } = useCapture();
  const { captureResult, currentState, goTo, setCaptureResult } = useSession();
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

  const frameEditorImageUrl = useMemo(() => {
    if (captureResult?.success !== true) {
      return null;
    }

    return URL.createObjectURL(captureResult.blob);
  }, [captureResult]);

  useEffect(() => {
    if (frameEditorImageUrl === null) {
      return;
    }

    return () => {
      URL.revokeObjectURL(frameEditorImageUrl);
    };
  }, [frameEditorImageUrl]);

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

  const handleRetake = useCallback((): void => {
    setCaptureResult(null);
    goTo("CAMERA_PREVIEW");
  }, [goTo, setCaptureResult]);

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

  if (currentState === "FRAME_EDITOR" && frameEditorImageUrl !== null) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center gap-6 px-5 py-8 sm:px-8">
        <CaptureCanvas imageUrl={frameEditorImageUrl} />
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            className="min-h-16 w-full rounded-2xl bg-amber-600 px-6 py-4 text-xl font-bold text-white shadow-lg shadow-amber-900/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 active:bg-amber-800 sm:w-auto sm:flex-1 sm:text-2xl"
            onClick={handleRetake}
            type="button"
          >
            Retake
          </button>
          <button
            className="min-h-16 w-full rounded-2xl bg-slate-300 px-6 py-4 text-xl font-bold text-slate-500 sm:w-auto sm:flex-1 sm:text-2xl"
            disabled
            type="button"
          >
            Continue
          </button>
        </div>
      </main>
    );
  }

  if (currentState === "WELCOME") {
    return <WelcomeScreen onStart={() => goTo("CAMERA_PERMISSION")} />;
  }

  return null;
}
