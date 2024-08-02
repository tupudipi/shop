import { Suspense } from 'react';
import ProductList from '@/app/components/ProductList';

async function fetchCategoryId(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories?category_name=${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch category data');
  }
  const category = await res.json();
  return category.id;
}

async function fetchProductsWithReviewCount(categoryId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products-with-review-count?categoryId=${categoryId}`, { cache: 'no-store' });
  if (!res.ok) {
    console.error("Failed to fetch products, response:", res);
    throw new Error('Failed to fetch products');
  }
  const products = await res.json();
  return products;
}

export async function generateMetadata({ params }) {
  return {
    title: `Cico ${params.category}`,
    description: `Explore products in the ${params.category} category.`,
  };
}

export default async function Page({ params }) {
  const categoryId = await fetchCategoryId(params.category);
  const products = await fetchProductsWithReviewCount(categoryId);

  return (
    <div className="h-full overflow-y-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductList initialProducts={products} />
      </Suspense>
    </div>
  );
}