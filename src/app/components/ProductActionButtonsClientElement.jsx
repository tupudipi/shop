'use client'

import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import { WishlistContext } from '@/context/WishlistContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

const ProductActionButtonsClientElement = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);

  const isFav = wishlist.some(item => item.slug === product.slug);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleWishlist = () => {
    if (isFav) {
      removeFromWishlist(product.slug);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
      <button
        className={`px-4 py-1 rounded-lg transition-colors ${isFav ? 'text-red-500 hover:text-red-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        onClick={handleToggleWishlist}
      >
        {isFav ? (
          <FontAwesomeIcon icon={faHeartSolid} />
        ) : (
          <FontAwesomeIcon icon={faHeartRegular} />
        )}
      </button>
    </div>
  );
};

export default ProductActionButtonsClientElement;