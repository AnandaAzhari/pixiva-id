# Changelog

## v1.0.0

- Initial project setup

### Sprint 2 - Phase 4

- Added the `SessionRoot` component.
- Connected `WelcomeScreen` to the Session flow.
- Made `WelcomeScreen` presentation-only.
- Updated `app/page.tsx` to render `SessionRoot`.
- Made the Start button transition the session to `CAMERA_PERMISSION`.

### Sprint 2 - Phase 5

- Added the `CameraContainer` component.
- Connected camera permission to camera preview.
- Ensured the camera stream initializes once per session flow.
- Made `CameraPermission` presentation-only.
- Made `CameraStage` presentation-only.
- Made `SessionRoot` responsible for the session flow.
