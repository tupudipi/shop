'use client';

import { createContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from "@/firebaseInit";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { data: session } = useSession();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        let unsubscribe;
        if (session) {
            const q = query(collection(db, 'Carts'), where('user_id', '==', session.user.email));
            unsubscribe = onSnapshot(q, (querySnapshot) => {
                const cartData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCart(cartData);
            });
        } else {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                setCart(JSON.parse(storedCart));
            }
        }
        return () => unsubscribe && unsubscribe();
    }, [session]);

    const addToCart = async (product) => {
        if (session) {
            const q = query(collection(db, 'Carts'), where('user_id', '==', session.user.email), where('slug', '==', product.slug));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const existingDoc = querySnapshot.docs[0];
                const existingProduct = existingDoc.data();
                const updatedProduct = { 
                    ...existingProduct, 
                    quantity: (existingProduct.quantity || 1) + (product.quantity || 1) 
                };
                const docRef = doc(db, 'Carts', existingDoc.id);
                await updateDoc(docRef, updatedProduct);
            } else {
                await addDoc(collection(db, 'Carts'), {
                    ...product,
                    user_id: session.user.email,
                    quantity: product.quantity || 1
                });
            }
        } else {
            const existingProduct = cart.find(item => item.slug === product.slug);
            let updatedCart;
            if (existingProduct) {
                updatedCart = cart.map(item =>
                    item.slug === product.slug ? {
                        ...item,
                        quantity: (item.quantity || 1) + (product.quantity || 1)
                    } : item
                );
            } else {
                updatedCart = [...cart, { ...product, quantity: product.quantity || 1 }];
            }
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const removeFromCart = async (slug) => {
        if (session) {
            const q = query(collection(db, 'Carts'), where('user_id', '==', session.user.email), where('slug', '==', slug));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const existingDoc = querySnapshot.docs[0];
                const docRef = doc(db, 'Carts', existingDoc.id);
                await deleteDoc(docRef);
            }
        } else {
            const updatedCart = cart.filter(item => item.slug !== slug);
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const decrementCartItem = async (slug) => {
        if (session) {
            const q = query(collection(db, 'Carts'), where('user_id', '==', session.user.email), where('slug', '==', slug));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const existingDoc = querySnapshot.docs[0];
                const existingProduct = existingDoc.data();
                if (existingProduct.quantity > 1) {
                    const updatedProduct = { ...existingProduct, quantity: existingProduct.quantity - 1 };
                    const docRef = doc(db, 'Carts', existingDoc.id);
                    await updateDoc(docRef, updatedProduct);
                } else {
                    const docRef = doc(db, 'Carts', existingDoc.id);
                    await deleteDoc(docRef);
                }
            }
        } else {
            const updatedCart = cart
                .map(item => item.slug === slug ? { ...item, quantity: item.quantity - 1 } : item)
                .filter(item => item.quantity > 0);
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const incrementCartItem = async (slug) => {
        if (session) {
            const q = query(collection(db, 'Carts'), where('user_id', '==', session.user.email), where('slug', '==', slug));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const existingDoc = querySnapshot.docs[0];
                const existingProduct = existingDoc.data();
                const updatedProduct = { ...existingProduct, quantity: existingProduct.quantity + 1 };
                const docRef = doc(db, 'Carts', existingDoc.id);
                await updateDoc(docRef, updatedProduct);
            }
        } else {
            const updatedCart = cart.map(item =>
                item.slug === slug ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, decrementCartItem, incrementCartItem }}>
            {children}
        </CartContext.Provider>
    );
};
