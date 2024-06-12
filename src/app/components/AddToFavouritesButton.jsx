'use client'

import { useContext } from 'react';
import { WishlistContext } from '@/context/WishlistContext';

export default function AddToFavouritesButton({ product }) {
    const { addToWishlist } = useContext(WishlistContext);

    return (
        <button
            className="bg-gray-200 text-gray-800 px-4 py-1 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => addToWishlist(product)}
        >
            Add to favourites
        </button>
    );
}
