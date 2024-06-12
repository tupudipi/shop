import ProductCard from "@/app/components/ProductCard";

async function fetchAllProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/`, { cache: 'no-store' });
  if (!res.ok) {
    console.error("Failed to fetch products, response:", res); // Add logging here
    throw new Error('Failed to fetch products');
  }
  const products = await res.json();
  // console.log("Fetched products:", products); // Add logging here
  return products;
}

export async function generateMetadata() {
  return {
    title: `Cico All Products`,
    description: `Explore all products.`,
  };
}

export default async function SearchPage() {
  const products = await fetchAllProducts();

  return (
    <div>
      <div className="flex flex-col md:flex-row px-12 md:px-0 flex-wrap gap-4 mt-2">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}