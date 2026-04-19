export interface LowStockAlert {
  id: number;
  productId: number;
  productName: string;
  currentQuantity: number;
  minimumQuantity: number;
  category: string;
  createdDate: string;
}
