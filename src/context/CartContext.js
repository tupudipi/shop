'use client';

import { createContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from "@/firebaseInit";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { data: session } = useSession();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            if (session) {
                const q = query(collection(db, 'Carts'), where('user_id', '==', session.user.email));
                const querySnapshot = await getDocs(q);
                const cartData = [];
                querySnapshot.forEach((doc) => {
                    cartData.push({ id: doc.id, ...doc.data() });
                });
                setCart(cartData);
            } else {
                const storedCart = localStorage.getItem('cart');
                if (storedCart) {
                    setCart(JSON.parse(storedCart));
                }
            }
        };
        fetchCart();
    }, [session]);

    const addToCart = async (product) => {
        if (session) {
            const existingProductIndex = cart.findIndex(item => item.slug === product.slug);
            if (existingProductIndex !== -1) {
                const existingProduct = cart[existingProductIndex];
                const updatedProduct = { ...existingProduct, quantity: existingProduct.quantity + product.quantity };
                const docRef = doc(db, 'Carts', existingProduct.id);
                await updateDoc(docRef, updatedProduct);
                const updatedCart = [...cart];
                updatedCart[existingProductIndex] = updatedProduct;
                setCart(updatedCart);
            } else {
                const docRef = await addDoc(collection(db, 'Carts'), { ...product, user_id: session.user.email });
                const newProduct = { ...product, id: docRef.id };
                const updatedCart = [...cart, newProduct];
                setCart(updatedCart);
            }
        } else {
            const existingProduct = cart.find(item => item.slug === product.slug);
            let updatedCart;
            if (existingProduct) {
                updatedCart = cart.map(item =>
                    item.slug === product.slug ? { ...item, quantity: item.quantity + product.quantity } : item
                );
            } else {
                updatedCart = [...cart, product];
            }
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const decrementCartItem = async (slug) => {
        if (session) {
            const existingProductIndex = cart.findIndex(item => item.slug === slug);
            if (existingProductIndex !== -1) {
                const existingProduct = cart[existingProductIndex];
                if (existingProduct.quantity > 1) {
                    const updatedProduct = { ...existingProduct, quantity: existingProduct.quantity - 1 };
                    const docRef = doc(db, 'Carts', existingProduct.id);
                    await updateDoc(docRef, updatedProduct);
                    const updatedCart = [...cart];
                    updatedCart[existingProductIndex] = updatedProduct;
                    setCart(updatedCart);
                } else {
                    const docRef = doc(db, 'Carts', existingProduct.id);
                    await deleteDoc(docRef);
                    const updatedCart = cart.filter(item => item.id !== existingProduct.id);
                    setCart(updatedCart);
                }
            }
        } else {
            const updatedCart = cart
                .map(item =>
                    item.slug === slug ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter(item => item.quantity > 0);

            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const removeFromCart = async (slug) => {
        if (session) {
            const existingProduct = cart.find(item => item.slug === slug);
            if (existingProduct) {
                const docRef = doc(db, 'Carts', existingProduct.id);
                await deleteDoc(docRef);
                const updatedCart = cart.filter(item => item.slug !== slug);
                setCart(updatedCart);
            }
        } else {
            const updatedCart = cart.filter(item => item.slug !== slug);
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, decrementCartItem }}>
            {children}
        </CartContext.Provider>
    );
};
