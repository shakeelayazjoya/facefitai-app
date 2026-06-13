# Production Readiness Notes

This Expo app ports the Face Shape Lab web API surface and main flows into a native-first architecture.

## Implemented

- Expo Router app shell with auth-gated dashboard/profile/admin/report flows.
- Centralized Axios `apiClient` using `EXPO_PUBLIC_API_URL`.
- Secure token persistence with `expo-secure-store`.
- Refresh-token retry and automatic logout on expired sessions.
- React Query for all remote async state.
- Zustand auth/report stores.
- Reusable UI primitives under `src/components/ui`.
- Detector flows for face shape, symmetry, age, eye, lips, and nose.
- Protected scan upload, scan history, report detail, favorites, subscription, compare scans.
- Privacy image reuse flow and AI style edit studio.
- Admin analytics/users/reports/products surfaces.
- Light/dark theme constants, no hardcoded colors for app-specific UI.
- Expo Image for preview rendering.
- Camera and media permissions through `expo-image-picker`.
- EAS build profiles and OTA-ready config.
- Monitoring and analytics adapter scaffolding ready for Sentry/Firebase wiring.

## Web API parity source

The API mapping follows `facefitai-frontend/lib/api.ts`:

- `POST /api/analyze-face`
- `POST /api/analyze-nose`
- `POST /api/analyze-eye`
- `POST /api/analyze-lips`
- `POST /api/analyze-age`
- `POST /api/analyze-symmetry`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/refresh`
- `POST /api/scans/upload`
- `GET /api/scans/history`
- `GET /api/scans/:scanId`
- `GET /api/scans/:scanId/report/download`
- `POST /api/privacy/image-reuse`
- `GET /api/scans/compare?scan_ids=...`
- `GET /api/favorites`
- `POST /api/favorites`
- `GET /api/subscription`
- `POST /api/billing/checkout`
- `GET /api/admin/users`
- `GET /api/admin/reports`
- `GET /api/admin/analytics`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `POST /api/admin/products/:productId/feature`
- `POST /api/style/edit-image`

## Required local verification before store release

Run these commands on your machine after installing dependencies:

```bash
npm install
npm run typecheck
npx expo-doctor
npx expo export
eas build --platform android --profile production
eas build --platform ios --profile production
```

## Recommended final wiring

- Add real Sentry DSN and initialize `@sentry/react-native` in `src/services/monitoring.ts`.
- Add Firebase/Amplitude implementation in `src/services/analytics.ts` if product analytics are required.
- Replace `REPLACE_WITH_PROJECT_ID` in `app.json` updates URL with the real EAS project ID.
- Confirm App Store privacy labels and Google Play data safety answers match backend data collection.
