import { AuthError } from '../types/auth';
import { tokenStorage } from './tokenStorage';

interface ApiResponse<T> {
  data?: T;
  error?: AuthError;
}

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

async function request<T>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
  const { requiresAuth = true, ...fetchConfig } = config;
  
  try {
    const headers = new Headers(fetchConfig.headers);

    if (requiresAuth) {
      const token = tokenStorage.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    if (!headers.has('Content-Type') && !(fetchConfig.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...fetchConfig,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle validation errors
      if (response.status === 400 && data.subErrors) {
        const validationError: AuthError = {
          message: data.message,
          field: data.subErrors[0]?.field,
        };
        throw validationError;
      }

      // Handle authentication errors
      if (response.status === 401) {
        tokenStorage.removeToken();
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }

      throw new Error(data.error || data.message || 'Something went wrong');
    }

    return { data: data as T };
  } catch (error) {
    if (error instanceof Error) {
      return { error: { message: error.message } };
    }
    return { error: { message: 'An unexpected error occurred' } };
  }
}

export const apiClient = {
  get: <T>(url: string, config?: RequestConfig) => 
    request<T>(url, { ...config, method: 'GET' }),
  
  post: <T>(url: string, body: any, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'POST', body: JSON.stringify(body) }),
  
  put: <T>(url: string, body: any, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'PUT', body: JSON.stringify(body) }),
  
  delete: <T>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'DELETE' }),
  
  upload: <T>(url: string, formData: FormData, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'POST', body: formData })
};