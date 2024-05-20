import Link from "next/link"

const ProductCard = ({ isFav }) => {
    return (
        <div className="flex flex-col gap-4 bg-white py-4 px-2 md:p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <Link href="/products/1"><div className="w-40 h-40 md:w-48 md:h-48 bg-gray-200 rounded-lg"></div></Link>
            <div className="flex flex-col gap-4">
                <Link href="/products/1"><h3 className="text-lg">Product 1</h3></Link>
                <div id="star-review" className="flex justify-between">
                    <div className="flex gap-1">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    </div>
                    <p className="text-sm">4.0 <span className="text-gray-500">(98)</span></p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-bold">$10.00</p>
                    <button className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors">Add to Cart</button>

                    {
                        isFav ?
                            <button className="text-red-500 hover:text-red-600 hover:underline  transition-all ">Delete</button>
                            : null
                    }
                </div>
            </div >
        </div>
    )
}

export default ProductCard