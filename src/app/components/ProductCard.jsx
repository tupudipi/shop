import Link from "next/link"
import Image from "next/image"

const ProductCard = ({ product, isFav }) => {
    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow items-center">
            <Link href={`/products/${product.slug}`}>
                <div className="grid place-content-center">
                    <Image src={product.image} alt={product.name} objectFit="cover" className="rounded-lg shadow-lg" 
                        width={160}
                        height={160}/>
                </div>
            </Link>
            <div className="flex flex-col gap-4">
                <Link href={`/products/${product.slug}`}>
                    <h3 className="text-lg text-start">{product.name}</h3>
                </Link>
                <div id="star-review" className="flex justify-between gap-3">
                    <div className="flex gap-1">
                        {Array.from({ length: product.reviewValue }, (_, index) => (
                            <div key={index} className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        ))}
                        {Array.from({ length: 5 - product.reviewValue }, (_, index) => (
                            <div key={index} className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        ))}
                    </div>
                    <p className="text-sm">{product.reviewValue} <span className="text-gray-500">({product.reviewCount})</span></p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-bold text-start">${product.price.toFixed(2)}</p>
                    <button className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors">Add to Cart</button>

                    {isFav ? (
                        <button className="text-red-500 hover:text-red-600 hover:underline transition-all">Delete</button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
