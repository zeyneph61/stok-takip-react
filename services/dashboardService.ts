import { ExpiryAlert } from "../types/expiryAlert";
import { LowStockAlert } from "../types/lowStockAlert";
import { Product } from "../types/product";
import { SalesReport } from "../types/salesReport";
import { request } from "./api";

export const dashboardService = {
  getProducts: () => request<Product[]>("/product"),
  getLowStockAlerts: () => request<LowStockAlert[]>("/lowstockalert"),
  getExpiryAlerts: () => request<ExpiryAlert[]>("/expiryalert"),
  getTopSelling: (count = 10) =>
    request<SalesReport[]>(`/salesreport/top-selling?count=${count}`),
};
