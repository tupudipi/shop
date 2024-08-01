'use client';

import { useContext, useState } from 'react';
import { CartContext } from '@/context/CartContext';
import { WishlistContext } from '@/context/WishlistContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import Toast from './Toast';  // Import the Toast component

const ProductActionButtonsClientElement = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);
  const [toastConfig, setToastConfig] = useState({ show: false, message: '', isLoading: false });

  const isFav = wishlist.some(item => item.slug === product.slug);

  const handleAddToCart = () => {
    addToCart(product);
    setToastConfig({ show: true, message: 'Product added to cart!', isLoading: false });

    setTimeout(() => {
      setToastConfig({ show: false, message: '', isLoading: false });
    }, 2000);
  };

  const handleToggleWishlist = () => {
    if (isFav) {
      removeFromWishlist(product.slug);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-end">
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
      {toastConfig.show && (
        <Toast
          message={toastConfig.message}
          isLoading={toastConfig.isLoading}
          duration={2000}
        />
      )}
    </div>
  );
};

export default ProductActionButtonsClientElement;
