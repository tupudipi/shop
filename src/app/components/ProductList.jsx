'use client';

import { useContext, useMemo } from 'react';
import { SortContext } from '@/context/SortContext';
import ProductCard from "@/app/components/ProductCard";

export default function ProductList({ initialProducts }) {
  const { sortType, sortOrder } = useContext(SortContext);

  const sortedProducts = useMemo(() => {
    return [...initialProducts].sort((a, b) => {
      let comparison = 0;
      switch (sortType) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'reviewNumber':
          comparison = a.reviewCount - b.reviewCount;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [initialProducts, sortType, sortOrder]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 mt-2 justify-items-center h-full">
      {sortedProducts.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}