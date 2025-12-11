// API URL - измени на свой домен в продакшене
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Хелпер для запросов
async function request(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// ==================== PRODUCTS ====================

export async function getProducts() {
  return request('/products');
}

export async function getProduct(id: string) {
  return request(`/products/${id}`);
}

export async function createProduct(product: any) {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id: string, product: any) {
  return request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id: string) {
  return request(`/products/${id}`, {
    method: 'DELETE',
  });
}

// ==================== CATEGORIES ====================

export async function getCategories() {
  return request('/categories');
}

export async function createCategory(category: any) {
  return request('/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  });
}

export async function updateCategory(id: string, category: any) {
  return request(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  });
}

export async function deleteCategory(id: string) {
  return request(`/categories/${id}`, {
    method: 'DELETE',
  });
}

// ==================== BANNERS ====================

export async function getBanners() {
  return request('/banners');
}

export async function createBanner(banner: any) {
  return request('/banners', {
    method: 'POST',
    body: JSON.stringify(banner),
  });
}

export async function updateBanner(id: string, banner: any) {
  return request(`/banners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(banner),
  });
}

export async function deleteBanner(id: string) {
  return request(`/banners/${id}`, {
    method: 'DELETE',
  });
}
