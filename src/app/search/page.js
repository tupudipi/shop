import { Suspense } from 'react';
import ProductList from '@/app/components/ProductList';

async function fetchAllProductsWithReviewCount() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products-with-review-count`, { cache: 'no-store' });
  if (!res.ok) {
    console.error("Failed to fetch products, response:", res);
    throw new Error('Failed to fetch products');
  }
  const products = await res.json();
  return products;
}

export async function generateMetadata() {
  return {
    title: `Cico All Products`,
    description: `Explore all products.`,
  };
}

export default async function SearchPage() {
  const products = await fetchAllProductsWithReviewCount();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList initialProducts={products} />
    </Suspense>
  );
}