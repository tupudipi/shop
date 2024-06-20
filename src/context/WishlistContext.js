'use client'

import { createContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { collection, query, where, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from "@/firebaseInit";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { data: session } = useSession();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (session) {
                const q = query(collection(db, 'Wishlists'), where('user_id', '==', session.user.email));
                const querySnapshot = await getDocs(q);
                const wishlistData = [];
                querySnapshot.forEach((doc) => {
                    wishlistData.push(doc.data());
                });
                setWishlist(wishlistData);
            } else {
                const storedWishlist = localStorage.getItem('wishlist');
                if (storedWishlist) {
                    setWishlist(JSON.parse(storedWishlist));
                }
            }
        };
        fetchWishlist();
    }, [session]);

    const addToWishlist = async (product) => {
        if (session) {
            if (!wishlist.some(item => item.slug === product.slug)) {
                const updatedWishlist = [...wishlist, product];
                setWishlist(updatedWishlist);
                await addDoc(collection(db, 'Wishlists'), { ...product, user_id: session.user.email });
            }
        } else {
            if (!wishlist.some(item => item.slug === product.slug)) {
                const updatedWishlist = [...wishlist, product];
                setWishlist(updatedWishlist);
                localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            }
        }
    };

    const removeFromWishlist = async (slug) => {
        if (session) {
            const q = query(collection(db, 'Wishlists'), where('user_id', '==', session.user.email), where('slug', '==', slug));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            const updatedWishlist = wishlist.filter(item => item.slug !== slug);
            setWishlist(updatedWishlist);
        } else {
            const updatedWishlist = wishlist.filter(item => item.slug !== slug);
            setWishlist(updatedWishlist);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};