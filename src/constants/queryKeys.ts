export const queryKeys = {
  authUser: ['auth', 'user'] as const,
  scanHistory: ['scans', 'history'] as const,
  scanDetail: (scanId: string) => ['scans', 'detail', scanId] as const,
  favorites: ['favorites'] as const,
  subscription: ['subscription'] as const,
  adminAnalytics: ['admin', 'analytics'] as const,
  adminUsers: ['admin', 'users'] as const,
  adminReports: ['admin', 'reports'] as const,
  adminProducts: ['admin', 'products'] as const,
};
