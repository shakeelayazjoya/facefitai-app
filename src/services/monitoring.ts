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

export const monitoring: MonitoringService = {
  captureException: (error, context) => {
    if (__DEV__) {
      console.error('[monitoring]', error, context);
    }
  },
  addBreadcrumb: (breadcrumb) => {
    breadcrumbs.push(breadcrumb);
    if (breadcrumbs.length > 30) breadcrumbs.shift();
  },
};
