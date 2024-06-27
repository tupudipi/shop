import Navbar from "@/app/components/Navbar";
import CategoryShow from "@/app/components/CategoryShow";
import ProductDetails from "@/app/components/ProductDetails";
import Image from "next/image";
import ClientProductSection from "@/app/components/ClientProductSection";
import { db } from "@/firebaseInit";
import { doc, getDoc } from "firebase/firestore";
import ProductReviewClient from "@/app/components/ProductReviewClient";
import { ReviewProvider } from '@/context/ReviewContext';

async function fetchProductData(slug) {
    const productRef = doc(db, "Products", slug);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        throw new Error('Failed to fetch product data');
    }

    const productData = productSnap.data();
    return {
        slug: productSnap.id,
        ...productData,
        reviewValue: isNaN(productData.reviewValue) ? 0 : productData.reviewValue,
        reviewCount: isNaN(productData.reviewCount) ? 0 : productData.reviewCount
    };
}

const ProductPage = async ({ params }) => {
    const product = await fetchProductData(params.id);
    const lastStarWidth = `${(product.reviewValue % 1) * 100}%`;

    return (
        <div className="overflow-x-clip">
            <Navbar />
            <main className="container mx-auto px-4 md:px-8">
                <ReviewProvider initialReviewValue={product.reviewValue} initialReviewCount={product.reviewCount}>
                    <div id="product" className="flex flex-col md:grid md:grid-cols-2 gap-4 bg-white/80 border shadow rounded-lg p-8">
                        <div className="grid place-content-center">
                            <Image src={product.image} alt={product.name} objectFit="cover" className="rounded-lg shadow-lg"
                                width={320}
                                height={320} />
                        </div>

                        <div className="max-w-2xl flex flex-col justify-between">
                            <div>
                                <h1 className="text-3xl mb-2">{product.name}</h1>
                                <ProductReviewClient reviewValue={product.reviewValue} reviewCount={product.reviewCount} lastStarWidth={lastStarWidth} />

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
                    </div>

                    <div className="w-full flex justify-center">
                        <CategoryShow page={"prod"} categoryID={product.category_id} currentProductSlug={params.id} />
                    </div>

                    <ProductDetails description={product.description} slug={params.id} />
                </ReviewProvider>
            </main>
        </div>
    );
}

export default ProductPage;
