import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Product } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "KES") {
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  };
  return new Intl.NumberFormat("en-KE", options).format(amount);
}


export function groupAndSumProducts(products: Product[]): Product[] {
  const productMap = new Map<string, Product>();

  products.forEach(product => {
    const key = `${product.name}-${product.category}-${product.color}-${product.size}`.toLowerCase();
    
    if (productMap.has(key)) {
      const existingProduct = productMap.get(key)!;
      existingProduct.quantity += product.quantity;
    } else {
      productMap.set(key, { ...product });
    }
  });

  return Array.from(productMap.values());
}
