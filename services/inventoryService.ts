import { Product } from "../types/product";
import { request } from "./api";

export const inventoryService = {
  getProducts: () => request<Product[]>("/product"),
  getProductById: (id: number) => request<Product>(`/product/${id}`),
};
