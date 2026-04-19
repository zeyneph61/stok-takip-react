import { ExpiryAlert } from "../types/expiryAlert";
import { LowStockAlert } from "../types/lowStockAlert";
import { SalesReport } from "../types/salesReport";
import { StockMovement } from "../types/stockMovement";
import { request } from "./api";

export const stockMovementService = {
  getAll: () => request<StockMovement[]>("/stockmovement"),
  getById: (id: number) => request<StockMovement>(`/stockmovement/${id}`),
  create: (data: Omit<StockMovement, "id">) =>
    request<StockMovement>("/stockmovement", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const lowStockAlertService = {
  getAll: () => request<LowStockAlert[]>("/lowstockalert"),
  getById: (id: number) => request<LowStockAlert>(`/lowstockalert/${id}`),
};

export const expiryAlertService = {
  getAll: () => request<ExpiryAlert[]>("/expiryalert"),
  getById: (id: number) => request<ExpiryAlert>(`/expiryalert/${id}`),
};

export const salesReportService = {
  getAll: () => request<SalesReport[]>("/salesreport"),
  getTopSelling: (count = 10) =>
    request<SalesReport[]>(`/salesreport/top-selling?count=${count}`),
  getById: (id: number) => request<SalesReport>(`/salesreport/${id}`),
};
