"use client";

import { useEffect, useState } from 'react';
import { getProducts, getUniqueFilterOptions } from '@/lib/data';
import { groupAndSumProducts } from '@/lib/utils';
import Storefront from '@/components/storefront';
import { Product } from '@/lib/types';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-1/2 mx-auto mb-2" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const groupedProducts = groupAndSumProducts(products);
  const { categories, colors, sizes } = getUniqueFilterOptions(groupedProducts);

  return (
    <div className="container mx-auto px-4 py-8">
      <Storefront
        products={groupedProducts}
        categories={categories}
        colors={colors}
        sizes={sizes}
      />
    </div>
  );
}
