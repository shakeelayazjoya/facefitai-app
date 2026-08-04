import * as Sentry from '@sentry/react-native';

interface Breadcrumb {
  category: string;
  message: string;
  data?: Record<string, string | number | boolean | null>;
}

interface MonitoringService {
  captureException: (error: unknown, context?: Record<string, string | number | boolean | null>) => void;
  addBreadcrumb: (breadcrumb: Breadcrumb) => void;
}

const breadcrumbs: Breadcrumb[] = [];

// Stays completely inert until EXPO_PUBLIC_SENTRY_DSN is set in the build env, so
// unconfigured builds report nothing. Dev never reports either — it keeps the
// console fallback so the Sentry project is not filled with local noise.
const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
const reportingEnabled = Boolean(dsn) && !__DEV__;

let initialized = false;

export function initMonitoring(): void {
  if (!reportingEnabled || initialized) return;
  initialized = true;
  Sentry.init({
    dsn,
    // This app uploads face photos, so never let the SDK attach PII.
    sendDefaultPii: false,
    // Error reporting only; performance tracing stays off to keep overhead and quota low.
    tracesSampleRate: 0,
  });
}

export const monitoring: MonitoringService = {
  captureException: (error, context) => {
    if (__DEV__) {
      console.error('[monitoring]', error, context);
    }
    if (reportingEnabled) {
      Sentry.captureException(error, context ? { extra: context } : undefined);
    }
  },
  addBreadcrumb: (breadcrumb) => {
    breadcrumbs.push(breadcrumb);
    if (breadcrumbs.length > 30) breadcrumbs.shift();
    if (reportingEnabled) {
      Sentry.addBreadcrumb({ category: breadcrumb.category, message: breadcrumb.message, data: breadcrumb.data });
    }
  },
};
