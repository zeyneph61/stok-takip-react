export interface SalesReport {
  id: number;
  productId: number;
  productName?: string;
  category?: string;
  totalSales?: number;
  quantitySold?: number;
  totalQuantitySold?: number;
  totalRevenue: number;
  totalProfit?: number;
  averagePrice?: number;
  lastSaleDate?: string;
  month?: number;
  year?: number;
}
