import { StockMovement } from "../types/stockMovement";
import { request } from "./api";

export const stockMovementsService = {
  getAll: () => request<StockMovement[]>("/stockmovement"),
  getById: (id: number) => request<StockMovement>(`/stockmovement/${id}`),
  create: (data: Omit<StockMovement, "id">) =>
    request<StockMovement>("/stockmovement", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
