// /search/[category]/page.js

import ProductCard from "@/app/components/ProductCard";

async function fetchCategoryId(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories?category_name=${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch category data');
  }
  const category = await res.json();
  return category.id;
}

async function fetchProductsByCategoryId(categoryId, sort, order) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/category/${categoryId}?sort=${sort}&order=${order}`, { cache: 'no-store' });
  if (!res.ok) {
    console.error("Failed to fetch products, response:", res);
    throw new Error('Failed to fetch products');
  }
  const products = await res.json();
  return products;
}

export async function generateMetadata({ params }) {
  const categoryId = await fetchCategoryId(params.category);
  const products = await fetchProductsByCategoryId(categoryId, 'name', 'asc'); // default sorting

  return {
    title: `Cico ${params.category}`,
    description: `Explore products in the ${params.category} category.`,
  };
}

export default async function Page({ params, sort, order }) {
  const categoryId = await fetchCategoryId(params.category);
  const products = await fetchProductsByCategoryId(categoryId, sort, order);

  return (
    <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-normal">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
