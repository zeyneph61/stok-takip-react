export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  buyingPrice?: number;
  sellPrice?: number;
  price?: number;
  thresholdValue?: number;
  availability?: string;
  expiryDate?: string;
  soldLastMonth?: number;
  createdDate?: string;
  modifiedDate?: string;
}
