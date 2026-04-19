import { Product } from "../types/product";
import { request } from "./api";

export const productService = {
  getAll: () => request<Product[]>("/Product"),
  getById: (id: number) => request<Product>(`/Product/${id}`),
  create: (data: Omit<Product, "id">) =>
    request<Product>("/Product", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<Product>) =>
    request<Product>(`/Product/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`/Product/${id}`, {
      method: "DELETE",
    }),
};
