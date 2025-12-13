import { z } from 'zod';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(response: Response, data: any): ApiError {
    const message = data?.message || data?.error || getDefaultErrorMessage(response.status);
    const errors = data?.errors;
    return new ApiError(message, response.status, errors);
  }
}

function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication required. Please log in.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'A conflict occurred. The resource may already exist.';
    case 422:
      return 'Validation failed. Please check your input.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'An internal server error occurred. Please try again.';
    case 502:
      return 'Service temporarily unavailable. Please try again.';
    case 503:
      return 'Service is currently unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

// Token management
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem('access_token');
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  },
  
  setTokens: (accessToken: string, refreshToken?: string): void => {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  },
  
  clearTokens: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
  
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp - 60000; // 1 minute buffer
    } catch {
      return true;
    }
  },
};

// Request configuration
interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  retryOnUnauthorized?: boolean;
}

// API Client
async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { skipAuth = false, retryOnUnauthorized = true, ...fetchConfig } = config;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  // Add authorization header if not skipped
  if (!skipAuth) {
    const token = tokenStorage.getAccessToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers,
      credentials: 'include', // Include cookies for HTTP-only tokens
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Handle token refresh on 401
      if (response.status === 401 && retryOnUnauthorized) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return request<T>(endpoint, { ...config, retryOnUnauthorized: false });
        }
        // Redirect to login if refresh failed
        tokenStorage.clearTokens();
        window.location.href = '/auth';
        throw new ApiError('Session expired. Please log in again.', 401);
      }

      throw ApiError.fromResponse(response, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      'Unable to connect to the server. Please check your internet connection.',
      0
    );
  }
}

// Token refresh logic
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });

    if (!response.ok) return false;

    const data = await response.json();
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// HTTP method helpers
export const apiClient = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};
