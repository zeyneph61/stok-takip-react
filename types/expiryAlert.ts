export interface ExpiryAlert {
  id: number;
  productId: number;
  productName: string;
  expiryDate: string;
  daysUntilExpiry: number;
  quantity: number;
  category: string;
  createdDate: string;
}
