import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { notify } from './notifier';

function getErrorMessage(error: any): string {
  try {
    const status = error?.response?.status;
    const apiMessage = error?.response?.data?.message;
    const apiError = error?.response?.data?.error;
    const combined = [apiMessage, apiError].filter(Boolean).join(' — ');
    const message = combined || error?.message || 'An unexpected error occurred.';
    return status ? `${message} (HTTP ${status})` : message;
  } catch {
    return 'An unexpected error occurred.';
  }
}

function getKeyLabel(key: unknown): string | null {
  try {
    if (!key) return null;
    if (Array.isArray(key)) return key.map((k) => String(k)).join(':');
    return String(key);
  } catch {
    return null;
  }
}

function getSuccessMessage(data: any): string {
  try {
    const msg = data?.message || data?.data?.message;
    return msg ? String(msg) : 'Success';
  } catch {
    return 'Success';
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const msg = getErrorMessage(error);
      const label = getKeyLabel(query?.queryKey);
      notify({
        kind: 'error',
        message: 'Request Error',
        description: label ? `${msg} — Resource: ${label}` : msg,
        placement: 'topRight',
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const msg = getErrorMessage(error);
      const label = getKeyLabel((mutation as any)?.options?.mutationKey);
      notify({
        kind: 'error',
        message: 'Action Failed',
        description: label ? `${msg} — Operation: ${label}` : msg,
        placement: 'topRight',
      });
    },
    onSuccess: (data, _variables, _context, mutation) => {
      const label = getKeyLabel((mutation as any)?.options?.mutationKey);
      const message = getSuccessMessage(data);
      notify({
        kind: 'success',
        message,
        description: label ? `Operation: ${label}` : undefined,
        placement: 'topRight',
      });
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 2 * 60 * 1000,
      gcTime: 6 * 60 * 1000,
      refetchOnMount: true,
      refetchOnReconnect: true,
      placeholderData: (prev: any) => prev as any,
    },
    mutations: {
      retry: 0,
    },
  },
});
