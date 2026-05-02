export interface StockMovement {
  id: number;
  productId: number;
  movementType: "In" | "Out";
  quantity: number;
  date: string;
  product?: {
    id: number;
    name: string;
    category: string;
  } | null;
}
