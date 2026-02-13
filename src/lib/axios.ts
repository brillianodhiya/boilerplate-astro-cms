import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './config';
import { getToken, getRefreshToken, updateAccessToken, clearAuthData } from './auth';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Flag untuk mencegah multiple refresh token requests
let isRefreshing = false;
// Queue untuk menyimpan requests yang gagal karena token expired
let failedQueue: any[] = [];

// Memproses queue yang gagal
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor: menambahkan token ke setiap request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: menangani response error & auto-refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const urlPath = (originalRequest?.url || '').toLowerCase();

    // Jika error bukan 401 atau sudah di-retry, reject langsung
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Untuk endpoint login: biarkan komponen yang handle error
    if (urlPath.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // Jika sedang refresh token, tambahkan request ke queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();

    // Jika tidak ada refresh token, logout
    if (!refreshToken) {
      clearAuthData();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    try {
      // Request refresh token — sesuaikan endpoint dengan API backend Anda
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });

      const { accessToken } = response.data.data;

      // Update access token di storage
      updateAccessToken(accessToken);

      // Update header untuk request yang gagal
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Proses queue yang menunggu
      processQueue(null, accessToken);

      // Retry request yang gagal
      return api(originalRequest);
    } catch (refreshError) {
      // Jika refresh token gagal, logout
      processQueue(refreshError, null);
      clearAuthData();

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
