const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiOptions {
    method?: string;
    body?: Record<string, unknown> | unknown[];
    token?: string;
}

interface ApiError {
    message: string;
    statusCode: number;
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, token } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 API Request with token:', {
            endpoint,
            method,
            tokenPreview: token.substring(0, 20) + '...',
            hasToken: !!token
        });
    } else {
        console.log('❌ API Request WITHOUT token:', { endpoint, method });
    }

    console.log('📡 Making request to:', `${API_BASE_URL}${endpoint}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    console.log('📥 Response status:', response.status, response.statusText);

    // Handle empty responses (e.g., DELETE returns 200 with no body)
    const contentType = response.headers.get('content-type');
    const hasJson = contentType && contentType.includes('application/json');

    if (response.ok && !hasJson) {
        // Successful response with no JSON body (e.g., DELETE)
        return undefined as T;
    }

    if (!hasJson) {
        throw {
            message: 'Cannot connect to the API server. Make sure the backend is running on port 3001.',
            statusCode: response.status,
        } as ApiError;
    }

    const data = await response.json();

    if (!response.ok) {
        const error: ApiError = {
            message: Array.isArray(data.message) ? data.message[0] : (data.message || 'Something went wrong'),
            statusCode: response.status,
        };
        throw error;
    }

    return data as T;
}

// ── Auth API helpers ───────────────────────────────────

export interface AuthResponse {
    message: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
    access_token: string;
}

export interface ProfileResponse {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}

export const authApi = {
    login: (email: string, password: string) =>
        apiRequest<AuthResponse>('/auth/login', {
            method: 'POST',
            body: { email, password },
        }),

    register: (name: string, email: string, password: string) =>
        apiRequest<AuthResponse>('/auth/register', {
            method: 'POST',
            body: { name, email, password },
        }),

    getProfile: (token: string) =>
        apiRequest<ProfileResponse>('/auth/profile', {
            token,
        }),
};

// ── Products API helpers ──────────────────────────────

export interface ProductResponse {
    id: number;
    name: string;
    nameAr?: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    category: string;
    categoryAr?: string;
    image: string;
    badge?: string;
    inStock: boolean;
    stockQuantity: number;
    description: string;
    descriptionAr?: string;
    fullDescription?: string;
    fullDescriptionAr?: string;
    // Pallet-specific fields
    slug?: string;
    dimensions?: string;
    design?: string;
    weight?: string;
    staticLoad?: string;
    dynamicLoad?: string;
    rackLoad?: string;
    expectedLife?: string;
    isActive?: boolean;
    sortOrder?: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export const productsApi = {
    getAll: (params?: {
        category?: string;
        search?: string;
        sort?: string;
        minPrice?: number;
        maxPrice?: number;
    }) => {
        const searchParams = new URLSearchParams();
        if (params?.category && params.category !== 'All') searchParams.set('category', params.category);
        if (params?.search) searchParams.set('search', params.search);
        if (params?.sort) searchParams.set('sort', params.sort);
        if (params?.minPrice !== undefined) searchParams.set('minPrice', String(params.minPrice));
        if (params?.maxPrice !== undefined && params.maxPrice !== Infinity) searchParams.set('maxPrice', String(params.maxPrice));
        const qs = searchParams.toString();
        return apiRequest<ProductResponse[]>(`/products/public${qs ? `?${qs}` : ''}`);
    },

    getOne: (id: number) =>
        apiRequest<ProductResponse>(`/products/public/${id}`),

    /** Returns ALL products (including soft-deleted). Used by Plastic Pallets page. */
    getAllIncludingDeleted: (params?: { category?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.category) searchParams.set('category', params.category);
        const qs = searchParams.toString();
        return apiRequest<ProductResponse[]>(`/products/public/all${qs ? `?${qs}` : ''}`);
    },
};

// ── Admin Pages API helpers ───────────────────────────

export interface PageResponse {
    id: number;
    title: string;
    titleAr?: string;
    slug: string;
    content: string;
    contentAr?: string;
    metaTitle?: string;
    metaTitleAr?: string;
    metaDescription?: string;
    metaDescriptionAr?: string;
    isPublished: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export const adminPagesApi = {
    getAll: (token: string) =>
        apiRequest<PageResponse[]>('/pages?all=true', { token }),

    getOne: (id: number, token: string) =>
        apiRequest<PageResponse>(`/pages/${id}`, { token }),

    create: (data: Record<string, unknown>, token: string) =>
        apiRequest<PageResponse>('/pages', { method: 'POST', body: data, token }),

    update: (id: number, data: Record<string, unknown>, token: string) =>
        apiRequest<PageResponse>(`/pages/${id}`, { method: 'PATCH', body: data, token }),

    delete: (id: number, token: string) =>
        apiRequest<void>(`/pages/${id}`, { method: 'DELETE', token }),
};

// ── Admin Products API helpers ────────────────────────

export const adminProductsApi = {
    getAll: (token: string) =>
        apiRequest<ProductResponse[]>('/products', { token }),

    getOne: (id: number, token: string) =>
        apiRequest<ProductResponse>(`/products/${id}`, { token }),

    create: (data: Record<string, unknown>, token: string) =>
        apiRequest<ProductResponse>('/products', { method: 'POST', body: data, token }),

    update: (id: number, data: Record<string, unknown>, token: string) =>
        apiRequest<ProductResponse>(`/products/${id}`, { method: 'PATCH', body: data, token }),

    delete: (id: number, token: string) =>
        apiRequest<void>(`/products/${id}`, { method: 'DELETE', token }),
};

// ── Site Content API helpers ──────────────────────────

export interface SiteContentResponse {
    id: number;
    sectionKey: string;
    contentType: string;
    titleEn?: string;
    contentEn?: string;
    titleAr?: string;
    contentAr?: string;
    isDraft: boolean;
    publishedSnapshot?: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export const siteContentApi = {
    getAll: (token: string, includeDrafts = true) =>
        apiRequest<SiteContentResponse[]>(`/site-content${includeDrafts ? '?drafts=true' : ''}`, { token }),

    getOne: (id: number, token: string) =>
        apiRequest<SiteContentResponse>(`/site-content/${id}`, { token }),

    getByKey: (key: string) =>
        apiRequest<SiteContentResponse>(`/site-content/key/${key}`),

    create: (data: Record<string, unknown>, token: string) =>
        apiRequest<SiteContentResponse>('/site-content', { method: 'POST', body: data, token }),

    update: (id: number, data: Record<string, unknown>, token: string) =>
        apiRequest<SiteContentResponse>(`/site-content/${id}`, { method: 'PATCH', body: data, token }),

    publish: (id: number, token: string) =>
        apiRequest<SiteContentResponse>(`/site-content/${id}/publish`, { method: 'POST', body: {}, token }),

    delete: (id: number, token: string) =>
        apiRequest<void>(`/site-content/${id}`, { method: 'DELETE', token }),
};

// ── Orders API helpers (Secure Checkout) ─────────────────

export interface OrderItemResponse {
    productId: number;
    productName: string;
    productImage?: string;
    quantity: number;
    priceAtPurchase: number;
}

export interface OrderResponse {
    id: number;
    status: string;
    totalAmount: number;
    shippingAddress?: string;
    phone?: string;
    notes?: string;
    items: OrderItemResponse[];
    itemCount?: number;
    createdAt: string;
    updatedAt?: string;
}

export interface CheckoutResponse {
    message: string;
    clientSecret: string;
    order: OrderResponse;
}

export const ordersApi = {
    checkout: (
        data: {
            items: { productId: number; quantity: number }[];
            shippingAddress: string;
            phone: string;
            notes?: string;
            idempotencyKey: string;
        },
        token: string,
    ) =>
        apiRequest<CheckoutResponse>('/orders/checkout', {
            method: 'POST',
            body: data as unknown as Record<string, unknown>,
            token,
        }),

    getMyOrders: (token: string) =>
        apiRequest<OrderResponse[]>('/orders/my-orders', { token }),

    getOne: (id: number, token: string) =>
        apiRequest<OrderResponse>(`/orders/${id}`, { token }),
};

// ── Admin Users API helpers ───────────────────────────

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'super_admin';
    createdAt: string;
    updatedAt: string;
}

export const adminUsersApi = {
    getAll: (token: string) =>
        apiRequest<UserResponse[]>('/admin/users', { token }),

    updateRole: (id: number, role: 'admin' | 'user' | 'super_admin', token: string) =>
        apiRequest<UserResponse>(`/admin/users/${id}/role`, {
            method: 'PATCH',
            body: { role },
            token,
        }),

    delete: (id: number, token: string) =>
        apiRequest<void>(`/admin/users/${id}`, { method: 'DELETE', token }),

    create: (userData: { name: string; email: string; password: string; role: 'admin' | 'user' | 'super_admin' }, token: string) =>
        apiRequest<UserResponse>('/admin/users', {
            method: 'POST',
            body: userData,
            token,
        }),
};

// ── Content API helpers ───────────────────────────────

export interface ContentResponse {
    id: number;
    page: string;
    section: string;
    key: string;
    value: string;
    valueAr?: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface ContentMapResponse {
    [section: string]: {
        [key: string]: {
            value: string;
            valueAr?: string;
            id: number;
        };
    };
}

export const contentApi = {
    getHomeContent: () =>
        apiRequest<ContentMapResponse>('/content/home'),

    getPageContent: (page: string) =>
        apiRequest<ContentMapResponse>(`/content/page/${page}`),

    getAll: (token: string) =>
        apiRequest<ContentResponse[]>('/content', { token }),

    getOne: (id: number, token: string) =>
        apiRequest<ContentResponse>(`/content/${id}`, { token }),

    create: (data: { page: string; section: string; key: string; value: string; valueAr?: string; sortOrder?: number }, token: string) =>
        apiRequest<ContentResponse>('/content', { method: 'POST', body: data, token }),

    update: (id: number, data: Partial<{ page: string; section: string; key: string; value: string; valueAr?: string; sortOrder?: number }>, token: string) =>
        apiRequest<ContentResponse>(`/content/${id}`, { method: 'PATCH', body: data, token }),

    bulkUpdate: (updates: { id: number; value?: string; valueAr?: string }[], token: string) =>
        apiRequest<ContentResponse[]>('/content/bulk-update', { method: 'PATCH', body: updates, token }),

    delete: (id: number, token: string) =>
        apiRequest<void>(`/content/${id}`, { method: 'DELETE', token }),
};

// ── Stripe Payment Settings API helpers ──────────────────

export interface StripeSettingsResponse {
    stripePublicKey: string;
    stripeSecretKeyMasked: string;
    stripeWebhookSecretMasked: string;
    isEnabled: boolean;
}

export const stripeApi = {
    /** Public — no auth required */
    getPublicKey: () =>
        apiRequest<{ publicKey: string }>('/stripe/public-key'),

    /** Super admin only */
    getSettings: (token: string) =>
        apiRequest<StripeSettingsResponse>('/stripe/settings', { token }),

    /** Super admin only */
    saveSettings: (
        data: {
            stripePublicKey: string;
            stripeSecretKey?: string;
            stripeWebhookSecret?: string;
            isEnabled: boolean;
        },
        token: string,
    ) =>
        apiRequest<{ message: string }>('/stripe/settings', {
            method: 'PUT',
            body: data as unknown as Record<string, unknown>,
            token,
        }),

    /** Super admin only */
    testConnection: (token: string) =>
        apiRequest<{ success: boolean; message: string }>('/stripe/test-connection', {
            method: 'POST',
            body: {},
            token,
        }),
};

// ── Profile API ──────────────────────────────────────────
export const profileApi = {
    updateProfile: (data: { name?: string; phone?: string; bio?: string }, token: string) =>
        apiRequest<{ message: string; user: Record<string, unknown> }>('/auth/profile', {
            method: 'PATCH',
            body: data as unknown as Record<string, unknown>,
            token,
        }),

    changePassword: (currentPassword: string, newPassword: string, token: string) =>
        apiRequest<{ message: string }>('/auth/change-password', {
            method: 'POST',
            body: { currentPassword, newPassword } as unknown as Record<string, unknown>,
            token,
        }),

    uploadAvatar: async (file: File, token: string) => {
        const formData = new FormData();
        formData.append('avatar', file);
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${API_BASE}/auth/upload-avatar`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: 'Upload failed' }));
            throw new Error(err.message);
        }
        return res.json() as Promise<{ message: string; user: Record<string, unknown> }>;
    },

    getOrders: (token: string) =>
        apiRequest<Record<string, unknown>[]>('/orders/my-orders', { token }),
};