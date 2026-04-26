import { Product } from "../types/product";
import { request } from "./api";

const PRODUCTS_CACHE_TTL_MS = 5 * 60 * 1000;
let productsCache: { data: Product[]; timestamp: number } | null = null;
let inFlightProductsRequest: Promise<Product[]> | null = null;

function setProductsCache(data: Product[]) {
  productsCache = {
    data,
    timestamp: Date.now(),
  };
}

function isProductsCacheFresh() {
  if (!productsCache) return false;
  return Date.now() - productsCache.timestamp < PRODUCTS_CACHE_TTL_MS;
}

function clearProductsCache() {
  productsCache = null;
}

async function fetchProducts(forceRefresh = false): Promise<Product[]> {
  if (!forceRefresh && isProductsCacheFresh()) {
    return productsCache!.data;
  }

  if (!forceRefresh && inFlightProductsRequest) {
    return inFlightProductsRequest;
  }

  const requestPromise = request<Product[]>("/product")
    .then((data) => {
      const normalized = Array.isArray(data) ? data : [];
      setProductsCache(normalized);
      return normalized;
    })
    .finally(() => {
      inFlightProductsRequest = null;
    });

  inFlightProductsRequest = requestPromise;
  return requestPromise;
}

export const inventoryService = {
  getProducts: (options?: { forceRefresh?: boolean }) =>
    fetchProducts(Boolean(options?.forceRefresh)),
  getCachedProducts: () => productsCache?.data ?? null,
  getProductById: (id: number) => request<Product>(`/product/${id}`),
  createProduct: (data: Omit<Product, "id" | "createdDate" | "modifiedDate">) =>
    request<Product>("/product", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((created) => {
      clearProductsCache();
      return created;
    }),
  updateProduct: (id: number, data: Partial<Product>) =>
    request<Product>(`/product/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }).then((updated) => {
      clearProductsCache();
      return updated;
    }),
  deleteProduct: (id: number) =>
    request<void>(`/product/${id}`, {
      method: "DELETE",
    }).then((result) => {
      clearProductsCache();
      return result;
    }),
};
