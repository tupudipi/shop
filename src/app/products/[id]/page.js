import Navbar from "@/app/components/Navbar";
import CategoryShow from "@/app/components/CategoryShow";
import ProductDetails from "@/app/components/ProductDetails";
import Image from "next/image";
import ClientProductSection from "@/app/components/ClientProductSection";

async function fetchProductData(slug) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch product data');
    }
    const product = await res.json();
    return product;
}

export async function generateStaticParams() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, { cache: 'no-store' }); 
    const products = await res.json();

    return products.map(product => ({ slug: product.slug }));
}

const ProductPage = async ({ params }) => {
    const product = await fetchProductData(params.id);
    return (
        <div className="overflow-x-clip">
            <Navbar />
            <main className="container mx-auto px-4 md:px-8">
                <div id="product" className="flex flex-col md:grid md:grid-cols-2 gap-4 bg-white/80 border shadow rounded-lg p-8">
                    <div className="grid place-content-center">
                        <Image src={product.image} alt={product.name} objectFit="cover" className="rounded-lg shadow-lg"
                            width={320}
                            height={320} />
                    </div>

                    <div className="max-w-2xl flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl mb-2">{product.name}</h1>
                            <div className="flex gap-4 align-middle">
                                <div className="flex gap-1 items-middle">
                                    {Array.from({ length: product.reviewValue }, (_, index) => (
                                        <div key={index} className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                    ))}
                                    {Array.from({ length: 5 - product.reviewValue }, (_, index) => (
                                        <div key={index} className="w-4 h-4 bg-gray-300 rounded-full"></div>
                                    ))}
                                </div>
                                <p className="text-sm">{product.reviewValue} <span className="text-gray-500">({product.reviewCount})</span></p>
                            </div>
                        </div>

                        <p className="font-bold text-2xl">${product.price}</p>

                        <div>
                            <div className="flex flex-col mt-4 gap-4">
                                <div className="flex flex-col gap-2">
                                    <p className={`text-green-700 ${product.stock > 0 ? 'block' : 'hidden'}`}>In stock</p>
                                    <p className={`text-red-700 ${product.stock === 0 ? 'block' : 'hidden'}`}>Out of stock</p>
                                    <p className={`text-yellow-500 ${product.stock > 0 && product.stock <= 10 ? 'block' : 'hidden'}`}>Only {product.stock} left!</p>

                                    <ClientProductSection product={product} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center">
                    <CategoryShow page={"prod"} categoryID={product.category_id} currentProductSlug={params.slug} />
                </div>

                {console.log('slug: ' + params.slug)}
                <ProductDetails description={product.description} slug={params.id} />

            </main>
        </div>
    );
}

export default ProductPage;
