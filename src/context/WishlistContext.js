'use client'

import { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
            setWishlist(JSON.parse(storedWishlist));
        }
    }, []);

    const addToWishlist = (product) => {
        if (!wishlist.some(item => item.slug === product.slug)) {
            const updatedWishlist = [...wishlist, product];
            setWishlist(updatedWishlist);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        }
    };

    const removeFromWishlist = (slug) => {
        const updatedWishlist = wishlist.filter(item => item.slug !== slug);
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
