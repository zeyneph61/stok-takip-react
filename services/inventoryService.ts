import { Product } from "../types/product";
import { request } from "./api";

export const inventoryService = {
  getProducts: () => request<Product[]>("/product"),
  getProductById: (id: number) => request<Product>(`/product/${id}`),
  createProduct: (data: Omit<Product, "id" | "createdDate" | "modifiedDate">) =>
    request<Product>("/product", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProduct: (id: number, data: Partial<Product>) =>
    request<Product>(`/product/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
