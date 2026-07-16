import type {
  CameraError,
  CameraPermission,
  CameraStatus,
} from "@/features/camera/types/camera";

interface CameraPermissionView {
  title: string;
  message: string;
  actionLabel: "Allow Camera Access" | "Retry" | null;
}

interface CameraPermissionProps {
  error: CameraError | null;
  isSupported: boolean;
  loading: boolean;
  onRequestPermission: () => Promise<void>;
  onRetry: () => Promise<void>;
  permission: CameraPermission;
  status: CameraStatus;
}

function getPermissionView(
  isSupported: boolean,
  permission: CameraPermission,
  hasError: boolean,
  error: CameraError | null,
): CameraPermissionView {
  if (!isSupported) {
    return {
      title: "Camera unavailable",
      message: "This browser does not support camera access. Please use a supported browser and try again.",
      actionLabel: null,
    };
  }

  if (permission === "denied") {
    return {
      title: "Camera access is blocked",
      message: "Enable camera access in your browser settings, then retry.",
      actionLabel: "Retry",
    };
  }

  if (hasError) {
    return {
      title: "We could not prepare the camera",
      message: error?.message ?? "Please try again.",
      actionLabel: "Retry",
    };
  }

  if (permission === "granted") {
    return {
      title: "Camera access granted",
      message: "Your camera is ready. The live preview can now be started.",
      actionLabel: null,
    };
  }

  if (permission === "prompt") {
    return {
      title: "Allow camera access",
      message: "Tap the button below, then choose Allow when your browser asks for permission.",
      actionLabel: "Allow Camera Access",
    };
  }

  return {
    title: "Use your camera",
    message: "MamQi Booth needs camera access to begin your photo experience.",
    actionLabel: "Allow Camera Access",
  };
}

export function CameraPermission({
  error,
  isSupported,
  loading,
  onRequestPermission,
  onRetry,
  permission,
  status,
}: CameraPermissionProps) {
  const hasError = error !== null || status === "error";
  const permissionView = getPermissionView(
    isSupported,
    permission,
    hasError,
    error,
  );

  async function handleAction(): Promise<void> {
    if (permissionView.actionLabel === "Retry" && permission !== "denied") {
      await onRetry();
      return;
    }

    await onRequestPermission();
  }

  return (
    <section
      aria-busy={loading}
      aria-labelledby="camera-permission-title"
      className="mx-auto flex min-h-[320px] w-full max-w-md items-center px-5 py-8 sm:min-h-[360px] sm:px-8"
    >
      <div className="w-full rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 sm:p-8 dark:bg-slate-900 dark:ring-slate-700">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
          Camera setup
        </p>
        <div aria-live="polite" className="mt-4 space-y-3">
          <h2
            id="camera-permission-title"
            className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            {permissionView.title}
          </h2>
          <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
            {permissionView.message}
          </p>
        </div>
        {permissionView.actionLabel !== null ? (
          <button
            className="mt-8 min-h-14 w-full rounded-2xl bg-amber-500 px-6 text-lg font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            onClick={handleAction}
            type="button"
          >
            {loading ? "Checking camera access..." : permissionView.actionLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}
