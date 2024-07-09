import Link from "next/link";
import Image from "next/image";
import ProductCardQuantityClientElement from "./ProductCardQuantityClientElement";
import ProductActionButtonsClientElement from "./ProductActionButtonsClientElement";

const ProductCard = ({ product, isCart }) => {
  const reviewValue = Number(product.reviewValue) || 0;
  const reviewCount = product.reviewCount || 0;
  const lastStarWidth = `${(reviewValue % 1) * 100}%`;

  return (
    <div className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg transition-shadow w-full max-w-[280px] mx-auto">
      <Link href={`/products/${product.slug}`} className="block aspect-square relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-medium line-clamp-2 text-start">{product.name}</h3>
        </Link>
        <div id="star-review" className="flex items-center gap-3">
          <div className="flex gap-1">
            {[...Array(Math.floor(reviewValue))].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            ))}
            {reviewValue % 1 !== 0 && (
              <div className="relative w-4 h-4 bg-gray-300 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-yellow-500" style={{ width: lastStarWidth }}></div>
              </div>
            )}
            {[...Array(5 - Math.ceil(reviewValue))].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-300 rounded-full"></div>
            ))}
          </div>
          <p className="text-sm">
            {reviewValue}<span className="text-gray-500">({reviewCount})</span>
          </p>
        </div>
        <p className="font-medium text-lg mt-auto text-start">${product.price.toFixed(2)}</p>
        {isCart ? (
          <ProductCardQuantityClientElement product={product} />
        ) : (
          <ProductActionButtonsClientElement product={product} />
        )}
      </div>
    </div>
  );
};

export default ProductCard;