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
          <div className="mt-6 flex flex-col gap-3 px-8 md:flex-row md:p-0 md:flex-wrap">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3 px-8 md:flex-row md:p-0 md:flex-wrap">
            <p className="text-gray-500 italic">*Wind&apos;s howling*</p>
          </div>
        )
      }
    </div>
  );
}

export default WishlistPage;