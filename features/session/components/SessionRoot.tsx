"use client";

import { CameraPermission } from "@/features/camera/components/CameraPermission";
import { WelcomeScreen } from "@/features/session/components/WelcomeScreen";
import { useSession } from "@/features/session/hooks/useSession";

export function SessionRoot() {
  const { currentState, goTo } = useSession();

  if (currentState === "CAMERA_PERMISSION") {
    return <CameraPermission />;
  }

  return <WelcomeScreen onStart={() => goTo("CAMERA_PERMISSION")} />;
}
