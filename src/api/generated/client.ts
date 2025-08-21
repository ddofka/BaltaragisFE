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

      const data = await response.json();
      return data;
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
    let finalUrl = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        finalUrl += `?${queryString}`;
      }
    }
    
    return this.request<T>(finalUrl);
  }

  // POST requests
  private async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT requests
  private async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE requests
  private async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // PATCH requests (available for future use)
  // private async patch<T>(endpoint: string, data?: any): Promise<T> {
  //   return this.request<T>(endpoint, {
  //     method: 'PATCH',
  //     body: data ? JSON.stringify(data) : undefined,
  //   });
  // }

  // POST with FormData (for file uploads)
  private async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
    });
  }

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

  // ========== ADMIN ENDPOINTS ==========

  // Admin Products
  async getAllProductsAdmin(): Promise<types.Product[]> {
    return this.get<types.Product[]>('/admin/products');
  }

  async getProductByIdAdmin(id: number): Promise<types.Product> {
    return this.get<types.Product>(`/admin/products/${id}`);
  }

  async createProduct(data: types.CreateProductRequest): Promise<types.Product> {
    return this.post<types.Product>('/admin/products', data);
  }

  async updateProduct(id: number, data: types.UpdateProductRequest): Promise<types.Product> {
    return this.put<types.Product>(`/admin/products/${id}`, data);
  }

  async deleteProduct(id: number): Promise<void> {
    return this.delete<void>(`/admin/products/${id}`);
  }

  // Admin Product Photos
  async getPhotosByProductId(productId: number): Promise<types.ProductPhoto[]> {
    return this.get<types.ProductPhoto[]>(`/admin/product-photos/product/${productId}`);
  }

  async uploadProductPhoto(productId: number, file: File): Promise<types.PhotoUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.postFormData<types.PhotoUploadResponse>(`/admin/products/${productId}/photos/upload`, formData);
  }

  async updateProductPhoto(photoId: number, data: types.UpdateProductPhotoRequest): Promise<types.ProductPhoto> {
    return this.put<types.ProductPhoto>(`/admin/product-photos/${photoId}`, data);
  }

  async deleteProductPhoto(photoId: number): Promise<void> {
    return this.delete<void>(`/admin/product-photos/${photoId}`);
  }

  // Admin Translations
  async upsertTranslation(data: types.CreateTranslationRequest): Promise<types.TranslationResponse> {
    return this.post<types.TranslationResponse>('/admin/translations', data);
  }

  async bulkUpsertTranslations(data: types.BulkTranslationRequest): Promise<types.TranslationResponse[]> {
    return this.post<types.TranslationResponse[]>('/admin/translations/bulk', data);
  }

  async getTranslationsByLocale(locale: string): Promise<types.TranslationResponse[]> {
    return this.get<types.TranslationResponse[]>(`/admin/translations/locale/${locale}`);
  }

  async getTranslationsByKey(key: string): Promise<types.TranslationResponse[]> {
    return this.get<types.TranslationResponse[]>(`/admin/translations/key/${key}`);
  }

  async deleteTranslation(key: string, locale: string): Promise<void> {
    return this.delete<void>(`/admin/translations/${key}/${locale}`);
  }

  // Admin Pages
  async getAllPagesAdmin(): Promise<types.Page[]> {
    return this.get<types.Page[]>('/admin/pages');
  }

  async getPageByIdAdmin(id: number): Promise<types.Page> {
    return this.get<types.Page>(`/admin/pages/${id}`);
  }

  async createPage(data: types.CreatePageRequest): Promise<types.Page> {
    return this.post<types.Page>('/admin/pages', data);
  }

  async updatePage(id: number, data: types.UpdatePageRequest): Promise<types.Page> {
    return this.put<types.Page>(`/admin/pages/${id}`, data);
  }

  async deletePage(id: number): Promise<void> {
    return this.delete<void>(`/admin/pages/${id}`);
  }

  // Admin Artist Profile
  async updateArtistProfile(data: types.UpdateArtistProfileRequest): Promise<types.ArtistProfile> {
    return this.put<types.ArtistProfile>('/admin/artist', data);
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
