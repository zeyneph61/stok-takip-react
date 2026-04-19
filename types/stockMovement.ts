export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  movementType: "in" | "out" | "adjustment";
  reason?: string;
  createdDate: string;
}
