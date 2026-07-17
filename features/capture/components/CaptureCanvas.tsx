/* eslint-disable @next/next/no-img-element */

interface CaptureCanvasProps {
  imageUrl: string;
}

export function CaptureCanvas({ imageUrl }: CaptureCanvasProps) {
  return (
    <img
      alt="Captured photo"
      className="h-auto w-full rounded-3xl object-contain"
      src={imageUrl}
    />
  );
}
