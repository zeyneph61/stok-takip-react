export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  createdDate?: string;
  modifiedDate?: string;
}
