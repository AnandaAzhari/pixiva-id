"use client";

import { useEffect, useRef } from "react";

import { CameraPermission } from "@/features/camera/components/CameraPermission";
import { CameraStage } from "@/features/camera/components/CameraStage";
import { useCamera } from "@/features/camera/hooks/useCamera";
import { WelcomeScreen } from "@/features/session/components/WelcomeScreen";
import { useSession } from "@/features/session/hooks/useSession";

export function SessionRoot() {
  const { currentState, goTo } = useSession();
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

  if (currentState === "CAMERA_PREVIEW" && stream !== null) {
    const selectedDevice = devices.find(
      (device) => device.id === selectedDeviceId,
    );

    return (
      <CameraStage
        isFrontCamera={selectedDevice?.facing === "user"}
        stream={stream}
      />
    );
  }

  if (currentState === "WELCOME") {
    return <WelcomeScreen onStart={() => goTo("CAMERA_PERMISSION")} />;
  }

  return null;
}
