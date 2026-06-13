# FaceShapeApp Expo production port

This Expo app ports the `facefitai-frontend` feature set into a native-first mobile architecture.

## Implemented parity

- Public content screens: About, Contact, Privacy, Disclaimer, FAQs, Pricing.
- Auth: login, signup, forgot-password request, secure token storage, global Zustand auth state.
- API: centralized axios client with auth injection, refresh retry, normalized errors.
- Core detectors: face shape, face symmetry, face age, eye shape, lip shape, nose shape.
- Dashboard: scan history, subscription status, favorites, scan comparison, report detail routing.
- Privacy workflow: image reuse scan.
- Style workflow: style edit image endpoint for hair, glasses, beard, lips, and nose.
- Admin workflow: analytics, users, products, feature toggle, protected by role.
- UI foundation: reusable Button, Input, Card, Badge, ListRow, EmptyState, LoadingSpinner, SkeletonBlock, ScreenWrapper, ErrorBoundary, ProtectedRoute.
- Native UX: Expo Router, protected routes, React Query async state, FlatList lists, pull-to-refresh, expo-image, expo-image-picker permissions, light/dark theme, reanimated detector entrance.

## Install commands

```bash
npx expo install expo-secure-store expo-image-picker expo-file-system expo-sharing
npm install axios @tanstack/react-query zustand react-native-skeleton-placeholder
```

## Required environment

```bash
EXPO_PUBLIC_API_URL=https://api.faceshapelab.com
```

## Production config

- `app.json` includes Expo Router, secure store, image picker, splash screen, app scheme, OTA updates block, and runtime version policy.
- `eas.json` includes development, preview, and production build profiles.
