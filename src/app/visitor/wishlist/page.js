'use client'

import ProductCard from "@/app/components/ProductCard";
import { useContext } from "react";
import { WishlistContext } from "@/context/WishlistContext";

function WishlistPage() {
  const { wishlist } = useContext(WishlistContext);
  const products = wishlist;

  return (
    <div>
      <h1 className="text-4xl font-medium">Wishlist</h1>
      {
        products.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-8 md:p-0">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-8 md:p-0">
            <p className="text-gray-500 italic">*Wind&apos;s howling*</p>
          </div>
        )
      }
    </div>
  );
}

export default WishlistPage;