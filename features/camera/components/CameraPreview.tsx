"use client";

import { CameraStage } from "@/features/camera/components/CameraStage";
import type { RefObject } from "react";

interface CameraPreviewProps {
  isFrontCamera: boolean;
  onTakePhoto: () => void;
  stream: MediaStream;
  videoRef: RefObject<HTMLVideoElement | null>;
}

export function CameraPreview({
  isFrontCamera,
  onTakePhoto,
  stream,
  videoRef,
}: CameraPreviewProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center gap-6 px-5 py-8 sm:px-8">
      <CameraStage isFrontCamera={isFrontCamera} stream={stream} videoRef={videoRef} />
      <button
        className="min-h-16 w-full rounded-2xl bg-amber-600 px-6 py-4 text-xl font-bold text-white shadow-lg shadow-amber-900/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700 active:bg-amber-800 sm:text-2xl"
        onClick={onTakePhoto}
        type="button"
      >
        Take Photo
      </button>
    </main>
  );
}
