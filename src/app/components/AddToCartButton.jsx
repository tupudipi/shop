'use client';

import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';

export default function AddToCartButton({ product, quantity }) {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
    };

    return (
        <button
            className="bg-gray-200 text-gray-800 px-4 py-1 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={handleAddToCart}
        >
            Add to cart
        </button>
    );
}
