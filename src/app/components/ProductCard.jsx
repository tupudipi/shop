import Link from "next/link";
import Image from "next/image";
import ProductCardQuantityClientElement from "./ProductCardQuantityClientElement";
import ProductActionButtonsClientElement from "./ProductActionButtonsClientElement";

const ProductCard = ({ product, isCart }) => {
  const reviewValue = Number(product.reviewValue) || 0;
  const reviewCount = product.reviewCount || 0;
  const lastStarWidth = `${(reviewValue % 1) * 100}%`;

  return (
    <div className="flex flex-col gap-3 bg-white p-3 rounded-lg shadow hover:shadow-lg transition-shadow items-center max-w-[260px] flex-1">
      <Link href={`/products/${product.slug}`}>
        <div className="grid place-content-center">
          <Image
            src={product.image}
            alt={product.name}
            objectFit="cover"
            className="rounded-lg shadow-lg"
            width={150}
            height={150}
          />
        </div>
      </Link>
      <div className="flex flex-col gap-4 justify-between h-[100%]">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg text-start">{product.name}</h3>
        </Link>
        <div id="star-review" className="flex justify-between items-center gap-1 md:gap-3">
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
        <div className="flex flex-col gap-2 justify-between">
          <p className="font-bold text-start">${product.price.toFixed(2)}</p>
          {isCart ? (
            <ProductCardQuantityClientElement product={product}/>
          ) : (
            <ProductActionButtonsClientElement product={product}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
