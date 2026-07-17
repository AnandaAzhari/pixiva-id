"use client";

import { useEffect, useRef, type RefObject } from "react";

interface CameraStageProps {
  isFrontCamera: boolean;
  stream: MediaStream;
  videoRef?: RefObject<HTMLVideoElement | null>;
}

export function CameraStage({ isFrontCamera, stream, videoRef }: CameraStageProps) {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const resolvedVideoRef = videoRef ?? internalVideoRef;

  useEffect(() => {
    const videoElement = resolvedVideoRef.current;

    if (videoElement === null) {
      return;
    }

    videoElement.srcObject = stream;

    return () => {
      if (videoElement.srcObject === stream) {
        videoElement.srcObject = null;
      }
    };
  }, [resolvedVideoRef, stream]);

  return (
    <section
      aria-label="Live camera preview"
      className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-slate-950"
    >
      <video
        aria-label="Live camera preview"
        autoPlay
        className={`absolute inset-0 h-full w-full object-cover ${
          isFrontCamera ? "transform -scale-x-100" : ""
        }`}
        muted
        playsInline
        ref={resolvedVideoRef}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
      />
    </section>
  );
}
