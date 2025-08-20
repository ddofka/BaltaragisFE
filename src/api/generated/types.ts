// Generated types from OpenAPI spec v0
// Auto-generated - do not edit manually

// Common types
export interface PageableObject {
  unpaged?: boolean;
  paged?: boolean;
  pageNumber?: number;
  pageSize?: number;
  offset?: number;
  sort?: SortObject;
}

export interface SortObject {
  unsorted?: boolean;
  sorted?: boolean;
  empty?: boolean;
}

// Product types
export interface Product {
  id: number;
  name: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  priceCents: number;
  currency: string;
  quantity: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCard {
  id: number;
  name: string;
  slug: string;
  price: string;
  currency: string;
  thumbnailUrl: string;
  inStock: boolean;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  price: string;
  currency: string;
  longDesc: string;
  quantity: number;
  photos: string[];
  updatedAt: string;
  inStock: boolean;
}

export interface PageProductCard {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: ProductCard[];
  number: number;
  sort: SortObject;
  empty: boolean;
}

// Page types
export interface Page {
  id: number;
  title: string;
  slug: string;
  contentMd: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageDto {
  title: string;
  slug: string;
  contentMd: string;
  updatedAt: string;
}

// Artist types
export interface ArtistProfile {
  id: number;
  name: string;
  bio: string;
  heroImageUrl: string;
  socials: string;
  updatedAt: string;
}

export interface ArtistDto {
  name: string;
  bio: string;
  heroImageUrl: string;
  socials: string;
  updatedAt: string;
}

// Order types
export interface CreateOrderRequest {
  productId?: number;
  productSlug: string;
  qty: number;
  email: string;
}

export interface CreateOrderResponse {
  orderId: number;
  status: string;
  total: string;
  currency: string;
}

// Waitlist types
export interface WaitlistRequest {
  email: string;
}

export type WaitlistStatus = 'ADDED' | 'ALREADY_SUBSCRIBED' | 'NOT_ELIGIBLE';

// Checkout types
export interface CreateCheckoutSessionRequest {
  productSlug: string;
  qty: number;
  email: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  checkoutUrl: string;
  sessionId: string;
  status: string;
}

// Translation types
export interface CreateTranslationRequest {
  key: string;
  locale: string;
  value: string;
}

export interface TranslationResponse {
  id: number;
  key: string;
  locale: string;
  value: string;
  updatedAt: string;
}

export interface BulkTranslationRequest {
  translations: Record<string, Record<string, string>>;
}

// Error types
export interface FieldError {
  field: string;
  message: string;
}

export interface Problem {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
  timestamp?: string;
  errors?: FieldError[];
}

// Admin types (for completeness)
export interface UpdateProductRequest {
  name?: string;
  shortDesc?: string;
  longDesc?: string;
  priceCents?: number;
  currency?: string;
  quantity?: number;
  isPublished?: boolean;
}

export interface UpdatePageRequest {
  title?: string;
  contentMd?: string;
  isPublished?: boolean;
}

export interface UpdateArtistProfileRequest {
  name: string;
  bio?: string;
  heroImageUrl?: string;
  socials?: string;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  shortDesc?: string;
  longDesc?: string;
  priceCents: number;
  currency?: string;
  quantity: number;
  isPublished?: boolean;
}

export interface CreatePageRequest {
  slug: string;
  title: string;
  contentMd?: string;
  isPublished?: boolean;
}

export interface CreateProductPhotoRequest {
  productId: number;
  url: string;
  alt?: string;
  sortOrder?: number;
  width?: number;
  height?: number;
}

export interface ProductPhoto {
  id: number;
  product: Product;
  url: string;
  alt: string;
  sortOrder: number;
  width: number;
  height: number;
}

export interface UpdateProductPhotoRequest {
  url?: string;
  alt?: string;
  sortOrder?: number;
  width?: number;
  height?: number;
}

export interface PhotoUploadResponse {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
  sortOrder: number;
  filename: string;
}
