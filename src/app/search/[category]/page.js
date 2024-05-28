import ProductCard from "@/app/components/ProductCard";

async function fetchCategoryId(slug) {
  const res = await fetch(`http://localhost:3000/api/categories?category_name=${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch category data');
  }
  const category = await res.json();
  // console.log("Fetched category ID:", category.id); // Add logging here
  return category.id; // return the category id
}

async function fetchProductsByCategoryId(categoryId) {
  const res = await fetch(`http://localhost:3000/api/products/category/${categoryId}`, { cache: 'no-store' });
  if (!res.ok) {
    console.error("Failed to fetch products, response:", res); // Add logging here
    throw new Error('Failed to fetch products');
  }
  const products = await res.json();
  // console.log("Fetched products:", products); // Add logging here
  return products;
}

export async function generateMetadata({ params }) {
  const categoryId = await fetchCategoryId(params.category);
  const products = await fetchProductsByCategoryId(categoryId);

  return {
    title: `Cico ${params.category}`,
    description: `Explore products in the ${params.category} category.`,
  };
}

export default async function Page({ params }) {
  const categoryId = await fetchCategoryId(params.category);
  const products = await fetchProductsByCategoryId(categoryId);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mt-2">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
