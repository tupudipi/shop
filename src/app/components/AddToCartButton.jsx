'use client'

import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';

export default function AddToCartButton({ product }) {
    const { addToCart } = useContext(CartContext);

    return (
        <button
            className="bg-gray-200 text-gray-800 px-4 py-1 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => addToCart(product)}
        >
            Add to cart
        </button>
    );
}
