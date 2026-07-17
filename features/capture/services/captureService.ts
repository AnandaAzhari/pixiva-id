const JPEG_MIME_TYPE = "image/jpeg";
const DEFAULT_JPEG_QUALITY = 0.92;

export function captureVideoFrame(video: HTMLVideoElement): HTMLCanvasElement {
  const { videoHeight, videoWidth } = video;

  if (videoWidth === 0 || videoHeight === 0) {
    throw new Error("The video frame is not ready to capture.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  const context = canvas.getContext("2d");

  if (context === null) {
    throw new Error("Unable to create a canvas context.");
  }

  context.drawImage(video, 0, 0, videoWidth, videoHeight);

  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number = DEFAULT_JPEG_QUALITY,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob === null) {
          reject(new Error("Unable to create an image blob."));
          return;
        }

        resolve(blob);
      },
      JPEG_MIME_TYPE,
      quality,
    );
  });
}
