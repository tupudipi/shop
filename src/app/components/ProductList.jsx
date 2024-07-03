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
    <div className="flex flex-wrap flex-col md:flex-row gap-4 mt-2 justify-center items-center md:justify-normal md:items-stretch md:pr-4">
      {sortedProducts.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}