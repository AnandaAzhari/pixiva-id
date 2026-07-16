"use client";

import { CameraPermission } from "@/features/camera/components/CameraPermission";
import { CameraStage } from "@/features/camera/components/CameraStage";
import { useEffect, useRef } from "react";

import { useCamera } from "@/features/camera/hooks/useCamera";

function CameraLoadingPlaceholder() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="flex aspect-[3/4] w-full items-center justify-center rounded-3xl bg-slate-950 px-6 text-center text-slate-200"
    >
      <p className="text-lg font-medium">Preparing your camera...</p>
    </section>
  );
}

export function CameraContainer() {
  const {
    devices,
    error,
    initializeCamera,
    isSupported,
    loading,
    permission,
    requestPermission,
    selectedDeviceId,
    status,
    stream,
  } = useCamera();
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;
    void initializeCamera();
  }, [initializeCamera]);

  const shouldShowPermission =
    !isSupported ||
    permission === "unknown" ||
    permission === "prompt" ||
    permission === "denied" ||
    status === "error" ||
    error !== null;

  if (loading) {
    return <CameraLoadingPlaceholder />;
  }

  if (shouldShowPermission) {
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

  if (permission === "granted" && stream !== null) {
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

  return <CameraLoadingPlaceholder />;
}
