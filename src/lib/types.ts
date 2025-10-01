import { FieldValue, Timestamp } from "firebase/firestore";

export type Product = {
  id: string;
  name: string;
  category: string;
  color: string;
  size: string;
  bp: number;
  sp: number;
  quantity: number;
  imageUrl: string;
  imageHint: string;
  createdAt: string | FieldValue;
  updatedAt: string | FieldValue;
};

export type Sale = {
  id: string;
  productId: string;
  quantity: number;
  sp: number;
  bp: number;
  profit: number;
  soldAt: Timestamp;
};

export type SaleWithProduct = Sale & {
    productName: string;
    productCategory: string;
    productColor: string;
    productSize: string;
}
