"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CameraPermission } from "@/features/camera/components/CameraPermission";
import { CameraPreview } from "@/features/camera/components/CameraPreview";
import { useCamera } from "@/features/camera/hooks/useCamera";
import { CaptureCanvas } from "@/features/capture/components/CaptureCanvas";
import { useCapture } from "@/features/capture/hooks/useCapture";
import type { CaptureResult } from "@/features/capture/types/capture";
import { CountdownSession } from "@/features/countdown/components/CountdownSession";
import { WelcomeScreen } from "@/features/session/components/WelcomeScreen";
import { useSession } from "@/features/session/hooks/useSession";

const DOWNLOAD_FILENAME = "pixiva-photo.jpg";
const PRINT_WINDOW_FEATURES = "width=800,height=600";
const SHARE_MESSAGE =
  "Sharing will be available once Pixiva.ID is deployed online.";
const FINISH_CONFIRMATION_TITLE = "Finish this session?";
const FINISH_CONFIRMATION_MESSAGE =
  "This will clear the current photo and prepare Pixiva.ID for the next user.";

export function SessionRoot() {
  const { capture: captureFrame } = useCapture();
  const { captureResult, currentState, goTo, reset, setCaptureResult } =
    useSession();
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
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [isConfirmingFinish, setIsConfirmingFinish] = useState(false);
  const doneButtonRef = useRef<HTMLButtonElement>(null);
  const cancelFinishButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (shareNotice === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShareNotice(null);
    }, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [shareNotice]);

  useEffect(() => {
    if (!isConfirmingFinish) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsConfirmingFinish(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isConfirmingFinish]);

  useEffect(() => {
    if (isConfirmingFinish) {
      cancelFinishButtonRef.current?.focus();
      return;
    }

    if (doneButtonRef.current !== null) {
      doneButtonRef.current.focus();
    }
  }, [isConfirmingFinish]);

  // Capture sequence foundation. Runs the capture action exactly once and
  // resolves with the same CaptureResult the underlying hook returns.
  const runCaptureSequence = useCallback(
    (video: HTMLVideoElement): Promise<CaptureResult> => {
      return captureFrame(video);
    },
    [captureFrame],
  );

  const handleCountdownFinished = useCallback((): void => {
    const videoElement = videoRef.current;

    if (videoElement === null) {
      goTo("CAMERA_PREVIEW");
      return;
    }

    void runCaptureSequence(videoElement).then((result) => {
      setCaptureResult(result);

      if (result.success) {
        goTo("FRAME_EDITOR");
        return;
      }

      goTo("CAMERA_PREVIEW");
    });
  }, [goTo, runCaptureSequence, setCaptureResult]);

  const handleRetake = useCallback((): void => {
    setCaptureResult(null);
    goTo("CAMERA_PREVIEW");
  }, [goTo, setCaptureResult]);

  const handleContinue = useCallback((): void => {
    goTo("DOWNLOAD");
  }, [goTo]);

  const handleDownload = useCallback((): void => {
    if (captureResult?.success !== true) {
      return;
    }

    const downloadUrl = URL.createObjectURL(captureResult.blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = DOWNLOAD_FILENAME;
    anchor.rel = "noopener";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(downloadUrl);
  }, [captureResult]);

  const handlePrint = useCallback((): void => {
    if (frameEditorImageUrl === null) {
      return;
    }

    const printWindow = window.open("", "_blank", PRINT_WINDOW_FEATURES);

    if (printWindow === null) {
      return;
    }

    const imageElement = printWindow.document.createElement("img");
    imageElement.src = frameEditorImageUrl;
    imageElement.alt = "Captured photo";
    imageElement.style.maxWidth = "100%";
    imageElement.style.height = "auto";

    imageElement.addEventListener(
      "load",
      () => {
        printWindow.focus();

        try {
          printWindow.print();
        } finally {
          printWindow.close();
        }
      },
      { once: true },
    );

    printWindow.document.body.appendChild(imageElement);
  }, [frameEditorImageUrl]);

  const handleShare = useCallback((): void => {
    setShareNotice(SHARE_MESSAGE);
  }, []);

  const handleDoneClick = useCallback((): void => {
    setIsConfirmingFinish(true);
  }, []);

  const handleCancelFinish = useCallback((): void => {
    setIsConfirmingFinish(false);
  }, []);

  const handleConfirmFinish = useCallback((): void => {
    setIsConfirmingFinish(false);
    reset();
  }, [reset]);

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
            className="min-h-16 w-full rounded-2xl bg-amber-600 px-6 py-4 text-xl font-bold text-white shadow-lg shadow-amber-900/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 active:bg-amber-800 sm:w-auto sm:flex-1 sm:text-2xl"
            onClick={handleContinue}
            type="button"
          >
            Continue
          </button>
        </div>
      </main>
    );
  }

  if (currentState === "DOWNLOAD" && frameEditorImageUrl !== null) {
    return (
      <>
        <main className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center gap-6 px-5 py-8 sm:px-8">
          <CaptureCanvas imageUrl={frameEditorImageUrl} />
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <button
              className="min-h-16 w-full rounded-2xl bg-amber-600 px-6 py-4 text-xl font-bold text-white shadow-lg shadow-amber-900/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 active:bg-amber-800 sm:w-auto sm:flex-1 sm:text-2xl"
              onClick={handleDownload}
              type="button"
            >
              Download
            </button>
            <button
              className="min-h-16 w-full rounded-2xl bg-amber-600 px-6 py-4 text-xl font-bold text-white shadow-lg shadow-amber-900/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 active:bg-amber-800 sm:w-auto sm:flex-1 sm:text-2xl"
              onClick={handlePrint}
              type="button"
            >
              Print
            </button>
            <button
              className="min-h-16 w-full rounded-2xl bg-amber-600 px-6 py-4 text-xl font-bold text-white shadow-lg shadow-amber-900/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 active:bg-amber-800 sm:w-auto sm:flex-1 sm:text-2xl"
              onClick={handleShare}
              type="button"
            >
              Share
            </button>
            <button
              className="min-h-16 w-full rounded-2xl bg-amber-600 px-6 py-4 text-xl font-bold text-white shadow-lg shadow-amber-900/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 active:bg-amber-800 sm:w-auto sm:flex-1 sm:text-2xl"
              onClick={handleDoneClick}
              ref={doneButtonRef}
              type="button"
            >
              Done
            </button>
          </div>
          {shareNotice !== null && (
            <div
              aria-live="polite"
              className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-5"
              role="status"
            >
              <span className="rounded-2xl bg-slate-900/90 px-5 py-3 text-center text-base font-semibold text-white shadow-lg sm:text-lg">
                {shareNotice}
              </span>
            </div>
          )}
        </main>
        {isConfirmingFinish && (
          <div
            aria-describedby="finish-confirm-message"
            aria-labelledby="finish-confirm-title"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5"
            role="dialog"
          >
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <h2
                className="text-2xl font-bold text-slate-900 sm:text-3xl"
                id="finish-confirm-title"
              >
                {FINISH_CONFIRMATION_TITLE}
              </h2>
              <p
                className="mt-3 text-base text-slate-700 sm:text-lg"
                id="finish-confirm-message"
              >
                {FINISH_CONFIRMATION_MESSAGE}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  className="min-h-14 w-full rounded-2xl bg-slate-200 px-5 py-3 text-lg font-bold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-400 active:bg-slate-300 sm:w-auto sm:px-6"
                  onClick={handleCancelFinish}
                  ref={cancelFinishButtonRef}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="min-h-14 w-full rounded-2xl bg-amber-600 px-5 py-3 text-lg font-bold text-white shadow-lg shadow-amber-900/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 active:bg-amber-800 sm:w-auto sm:px-6"
                  onClick={handleConfirmFinish}
                  type="button"
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (currentState === "WELCOME") {
    return <WelcomeScreen onStart={() => goTo("CAMERA_PERMISSION")} />;
  }

  return null;
}