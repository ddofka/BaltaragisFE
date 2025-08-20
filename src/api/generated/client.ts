// Generated API client from OpenAPI spec v0
// Auto-generated - do not edit manually

import * as types from './types';

// Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Lightweight request wrapper
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to parse error response
        let errorData: types.Problem | null = null;
        try {
          errorData = await response.json();
        } catch {
          // If we can't parse the error, create a generic one
          errorData = {
            status: response.status,
            title: response.statusText,
            detail: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
        
        throw new ApiError(errorData!, response.status, response.statusText);
      }

      // Handle empty responses
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        {
          status: 0,
          title: 'Network Error',
          detail: error instanceof Error ? error.message : 'Unknown error occurred',
        },
        0,
        'Network Error'
      );
    }
  }

  // GET requests
  private async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return this.request<T>(url.pathname + url.search);
  }

  // POST requests
  private async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT requests (available for future use)
  // private async put<T>(endpoint: string, data?: any): Promise<T> {
  //   return this.request<T>(endpoint, {
  //     method: 'PUT',
  //     body: data ? JSON.stringify(data) : undefined,
  //   });
  // }

  // DELETE requests (available for future use)
  // private async delete<T>(endpoint: string): Promise<T> {
  //   return this.request<T>(endpoint, {
  //     method: 'DELETE',
  //   });
  // }

  // Public API endpoints

  // GET /api/v1/artist
  async getArtist(): Promise<types.ArtistDto> {
    return this.get<types.ArtistDto>('/artist');
  }

  // GET /api/v1/products (with q/page/size)
  async getProducts(params?: {
    q?: string;
    page?: number;
    size?: number;
  }): Promise<types.PageProductCard> {
    return this.get<types.PageProductCard>('/products', params);
  }

  // GET /api/v1/products/{slug}
  async getProduct(slug: string): Promise<types.ProductDetail> {
    return this.get<types.ProductDetail>(`/products/${slug}`);
  }

  // POST /api/v1/products/{slug}/waitlist
  async addToWaitlist(slug: string, data: types.WaitlistRequest): Promise<types.WaitlistStatus> {
    return this.post<types.WaitlistStatus>(`/products/${slug}/waitlist`, data);
  }

  // POST /api/v1/orders
  async createOrder(data: types.CreateOrderRequest): Promise<types.CreateOrderResponse> {
    return this.post<types.CreateOrderResponse>('/orders', data);
  }

  // GET /api/v1/pages
  async getPages(): Promise<types.PageDto[]> {
    return this.get<types.PageDto[]>('/pages');
  }

  // GET /api/v1/pages/{slug}
  async getPage(slug: string): Promise<types.PageDto> {
    return this.get<types.PageDto>(`/pages/${slug}`);
  }

  // GET /api/v1/i18n/{locale}
  async getTranslations(locale: string): Promise<Record<string, string>> {
    return this.get<Record<string, string>>(`/i18n/${locale}`);
  }

  // Additional useful endpoints

  // GET /api/v1/i18n/locales
  async getSupportedLocales(): Promise<string[]> {
    return this.get<string[]>('/i18n/locales');
  }

  // GET /api/v1/i18n/current
  async getCurrentLocale(): Promise<string> {
    return this.get<string>('/i18n/current');
  }

  // POST /api/v1/orders/checkout-session
  async createCheckoutSession(data: types.CreateCheckoutSessionRequest): Promise<types.CheckoutSessionResponse> {
    return this.post<types.CheckoutSessionResponse>('/orders/checkout-session', data);
  }

  // GET /api/v1/orders/checkout-session/status
  async getCheckoutSessionStatus(sessionId: string): Promise<string> {
    return this.get<string>('/orders/checkout-session/status', { sessionId });
  }
}

// Custom error class for API errors
export class ApiError extends Error {
  public data: types.Problem;
  public status: number;
  public statusText: string;

  constructor(data: types.Problem, status: number, statusText: string) {
    super(data.detail || data.title || `HTTP ${status}: ${statusText}`);
    this.name = 'ApiError';
    this.data = data;
    this.status = status;
    this.statusText = statusText;
  }
}

// Export the client instance
export const apiClient = new ApiClient();

// Export the class for custom instances
export { ApiClient };

// Export all types
export * from './types';
