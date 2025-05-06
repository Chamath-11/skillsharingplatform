import { getToken, removeToken } from './tokenStorage';

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  statusCode: number;
  validationErrors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: string;
  statusCode?: number;
}

/**
 * Configurable API client for making HTTP requests
 */
const apiClient = {
  /**
   * Base URL for API requests
   */
  baseUrl: '/api',

  /**
   * Makes an HTTP request to the API
   */
  async request<T = any>(
    endpoint: string,
    method: string = 'GET',
    data: any = null,
    includeAuth: boolean = true,
    customHeaders: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders
    };

    // Add auth token if available and requested
    if (includeAuth) {
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = { method, headers };

    // Add request body for non-GET requests if data is provided
    if (method !== 'GET' && data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      
      // Try to parse response as JSON
      let responseData: any = null;
      let responseError: ApiError | null = null;
      
      try {
        responseData = await response.json();
      } catch (e) {
        // If response is not JSON, set data to null
        responseData = null;
      }

      // Handle 401 Unauthorized (expired token)
      if (response.status === 401 && includeAuth) {
        removeToken();
        
        // Reload the page to redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      // Format error from response
      if (!response.ok) {
        responseError = {
          message: responseData?.message || responseData?.error || 'An unexpected error occurred',
          errors: responseData?.errors || responseData?.validationErrors,
          status: responseData?.status,
          statusCode: response.status
        };
      }

      return {
        data: response.ok ? responseData : null,
        error: responseError ? responseError.message : null,
        statusCode: response.status,
        validationErrors: responseError?.errors
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Network error',
        statusCode: 0
      };
    }
  },

  /**
   * Shorthand methods for common HTTP verbs
   */
  async get<T = any>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', null, includeAuth);
  },

  async post<T = any>(endpoint: string, data: any, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', data, includeAuth);
  },

  async put<T = any>(endpoint: string, data: any, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', data, includeAuth);
  },

  async patch<T = any>(endpoint: string, data: any, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', data, includeAuth);
  },

  async delete<T = any>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', null, includeAuth);
  }
};

export default apiClient;