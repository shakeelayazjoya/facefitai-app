import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { strings } from '@/constants/strings';
import { monitoring } from './monitoring';
import { tokenStorage } from './tokenStorage';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  isNetworkError?: boolean;
}

interface ErrorPayload {
  detail?: string;
  message?: string;
  code?: string;
}

interface RefreshPayload {
  access_token: string;
  refresh_token?: string;
}

type UnauthorizedHandler = () => Promise<void> | void;

const envBaseUrl = process.env.EXPO_PUBLIC_API_URL;
const baseURL = envBaseUrl && envBaseUrl.length > 0 ? envBaseUrl : 'http://localhost:8000';
let unauthorizedHandler: UnauthorizedHandler | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 45000,
  headers: {
    Accept: 'application/json',
  },
});

export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  unauthorizedHandler = handler;
}

function markRetried(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  config.headers.set('x-retried', 'true');
  return config;
}

function hasRetried(config?: InternalAxiosRequestConfig): boolean {
  return config?.headers?.get('x-retried') === 'true';
}

async function refreshToken(): Promise<string | null> {
  const refresh = await tokenStorage.getRefreshToken();
  if (!refresh) return null;
  const response = await axios.post<RefreshPayload>(`${baseURL}/auth/refresh`, { refresh_token: refresh }, { timeout: 30000 });
  await tokenStorage.setAccessToken(response.data.access_token);
  if (response.data.refresh_token) await tokenStorage.setRefreshToken(response.data.refresh_token);
  return response.data.access_token;
}

function normalizeError(error: AxiosError<ErrorPayload>): ApiError {
  const payload = error.response?.data;
  const isNetworkError = !error.response;
  return {
    message: payload?.detail ?? payload?.message ?? (isNetworkError ? strings.offlineError : strings.genericError),
    status: error.response?.status,
    code: payload?.code,
    isNetworkError,
  };
}

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  monitoring.addBreadcrumb({ category: 'api', message: `${config.method?.toUpperCase() ?? 'GET'} ${config.url ?? ''}` });
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorPayload>) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !hasRetried(original)) {
      try {
        refreshPromise = refreshPromise ?? refreshToken().finally(() => {
          refreshPromise = null;
        });
        const nextToken = await refreshPromise;
        if (nextToken) {
          markRetried(original);
          original.headers.Authorization = `Bearer ${nextToken}`;
          return apiClient(original);
        }
      } catch (refreshError) {
        monitoring.captureException(refreshError, { scope: 'token_refresh' });
      }
      await unauthorizedHandler?.();
    }

    const normalized = normalizeError(error);
    monitoring.captureException(error, { scope: 'api', status: normalized.status ?? null, code: normalized.code ?? null });
    return Promise.reject(normalized);
  },
);
