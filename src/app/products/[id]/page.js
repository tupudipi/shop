import Navbar from "@/app/components/Navbar"
import CategoryShow from "@/app/components/CategoryShow";
import ProductDetails from "@/app/components/ProductDetails";
import ProductQuantity from "@/app/components/ProductQuantity";


const productPage = ({ params }) => {
    const productId = params.id;
    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 md:px-8">
                <div id="product" className="flex flex-col md:grid md:grid-cols-2 gap-4 bg-white/50 border shadow rounded-lg p-8">
                    <div className="grid place-content-center">
                        <div className="w-80 h-80 bg-gray-200 rounded-lg"></div>
                    </div>

                    <div className="max-w-2xl flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl mb-2">Product {productId}</h1>
                            <div className="flex gap-4 align-middle">
                                <div className="flex gap-1 align-middle">
                                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                                </div>
                                <p className="text-sm">4.0 <span className="text-gray-500">(98)</span></p>
                            </div>
                        </div>

                        <p className="font-bold text-2xl">$10.00</p>

                        <div>
                            <div className="flex flex-col mt-4 gap-4">
                                <div className="flex flex-col gap-2">
                                    <p className="text-green-700">In stock</p>

                                    <div className="md:w-3/4 lg:w-2/3 flex flex-col gap-2">
                                        <ProductQuantity />
                                        <button className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors">Add to Cart</button>
                                        <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded-lg hover:bg-gray-300 transition-colors">Add to favourites</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center">
                    <CategoryShow page={"prod"} />
                </div>

                <ProductDetails />

            </main>
        </>
    )
}

export default productPage