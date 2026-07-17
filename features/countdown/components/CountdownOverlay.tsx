interface CountdownOverlayProps {
  currentNumber: number;
  visible: boolean;
}

export function CountdownOverlay({
  currentNumber,
  visible,
}: CountdownOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      aria-label={`Countdown: ${currentNumber}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      role="status"
    >
      <span className="text-9xl font-bold text-white sm:text-[12rem]">
        {currentNumber}
      </span>
    </div>
  );
}
