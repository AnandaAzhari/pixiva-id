"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getAvailableVideoDevices, getCameraPermission, isCameraSupported, openCameraStream, releaseCameraResources, requestCameraAccess, stopCameraStream } from "@/features/camera/services/cameraService";
import type { CameraConstraints, CameraDevice, CameraError, CameraPermission, CameraStatus } from "@/features/camera/types/camera";

export function useCamera() {
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [permission, setPermission] = useState<CameraPermission>("unknown");
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CameraError | null>(null);
  const [isSupported, setIsSupported] = useState(isCameraSupported);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef(false);
  const operationIdRef = useRef(0);

  const setFailure = useCallback((nextError: CameraError): void => {
    if (!isMountedRef.current) return;
    setError(nextError);
    setLoading(false);
    setStatus("error");
    if (nextError.code === "permission-denied") setPermission("denied");
  }, []);

  const refreshDevices = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    const result = await getAvailableVideoDevices();
    if (!isMountedRef.current) return false;
    setLoading(false);
    if (!result.success) {
      setFailure(result.error);
      return false;
    }
    setDevices(result.data);
    setSelectedDeviceId((currentDeviceId) =>
      result.data.some((device) => device.id === currentDeviceId)
        ? currentDeviceId
        : (result.data[0]?.id ?? null),
    );
    setError(null);
    return true;
  }, [setFailure]);

  const initializeCamera = useCallback(async (): Promise<void> => {
    const supported = isCameraSupported();
    if (!isMountedRef.current) return;
    setIsSupported(supported);
    setError(null);
    if (!supported) {
      await refreshDevices();
      return;
    }
    const [nextPermission, hasDevices] = await Promise.all([getCameraPermission(), refreshDevices()]);
    if (!isMountedRef.current) return;
    setPermission(nextPermission);
    if (hasDevices) setStatus(streamRef.current === null ? "ready" : "streaming");
  }, [refreshDevices]);

  const requestPermission = useCallback(async (): Promise<void> => {
    const operationId = ++operationIdRef.current;
    setLoading(true);
    setStatus("requesting-permission");
    setError(null);
    const result = await requestCameraAccess();
    if (!isMountedRef.current || operationId !== operationIdRef.current) {
      if (result.success) stopCameraStream(result.data);
      return;
    }
    setLoading(false);
    if (!result.success) {
      setFailure(result.error);
      return;
    }
    stopCameraStream(result.data);
    setPermission("granted");
    setStatus("ready");
    await refreshDevices();
  }, [refreshDevices, setFailure]);

  const startCamera = useCallback(async (constraints: CameraConstraints = {}): Promise<void> => {
    const operationId = ++operationIdRef.current;
    const deviceId = constraints.deviceId ?? selectedDeviceId;
    const nextConstraints: CameraConstraints = deviceId === null ? constraints : { ...constraints, deviceId };
    stopCameraStream(streamRef.current);
    streamRef.current = null;
    setStream(null);
    setLoading(true);
    setStatus("requesting-permission");
    setError(null);
    const result = await openCameraStream(nextConstraints);
    if (!isMountedRef.current || operationId !== operationIdRef.current) {
      if (result.success) stopCameraStream(result.data);
      return;
    }
    setLoading(false);
    if (!result.success) {
      setFailure(result.error);
      return;
    }
    streamRef.current = result.data;
    setStream(result.data);
    setPermission("granted");
    setStatus("streaming");
    setIsSupported(true);
    if (deviceId !== null) setSelectedDeviceId(deviceId);
  }, [selectedDeviceId, setFailure]);

  const stopCamera = useCallback((): void => {
    operationIdRef.current += 1;
    stopCameraStream(streamRef.current);
    streamRef.current = null;
    if (!isMountedRef.current) return;
    setStream(null);
    setLoading(false);
    setStatus((currentStatus) => currentStatus === "streaming" || currentStatus === "requesting-permission" ? "ready" : currentStatus);
  }, []);

  const restartCamera = useCallback(async (constraints: CameraConstraints = {}): Promise<void> => {
    stopCamera();
    await startCamera(constraints);
  }, [startCamera, stopCamera]);

  const resetError = useCallback((): void => {
    if (!isMountedRef.current) return;
    setError(null);
    setStatus((currentStatus) => currentStatus === "error" ? (streamRef.current === null ? "idle" : "streaming") : currentStatus);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      releaseCameraResources(streamRef.current);
      streamRef.current = null;
    };
  }, []);

  return {
    status, permission, devices, selectedDeviceId, stream, loading, error, isSupported,
    initializeCamera, requestPermission, startCamera, stopCamera, restartCamera, refreshDevices, resetError,
  };
}
