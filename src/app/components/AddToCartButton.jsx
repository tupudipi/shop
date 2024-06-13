'use client';

import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';

export default function AddToCartButton({ product, quantity, setQuantity }) {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
        setQuantity(1);
    };

    return (
        <button
            className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleAddToCart}
        >
            Add to cart
        </button>
    );
}
