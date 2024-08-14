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
                const newQuantity = Math.min((existingProduct.quantity || 1) + (product.quantity || 1), product.stock);
                const updatedProduct = {
                    ...existingProduct,
                    quantity: newQuantity
                };
                const docRef = doc(db, 'Carts', existingDoc.id);
                await updateDoc(docRef, updatedProduct);
            } else {
                if (product.stock > 0) {
                    await addDoc(collection(db, 'Carts'), {
                        ...product,
                        user_id: session.user.email,
                        quantity: Math.min(product.quantity || 1, product.stock)
                    });
                }
            }
        } else {
            const updatedCart = [...cart];
            const existingProductIndex = updatedCart.findIndex(item => item.slug === product.slug);
            
            if (existingProductIndex !== -1) {
                const newQuantity = Math.min(
                    (updatedCart[existingProductIndex].quantity || 1) + (product.quantity || 1),
                    product.stock
                );
                updatedCart[existingProductIndex] = {
                    ...updatedCart[existingProductIndex],
                    quantity: newQuantity
                };
            } else {
                if (product.stock > 0) {
                    updatedCart.push({ 
                        ...product, 
                        quantity: Math.min(product.quantity || 1, product.stock) 
                    });
                }
            }
            
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    
        return product.stock > 0;
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

    const clearCart = async () => {
        if (session) {
            const q = query(collection(db, 'Carts'), where('user_id', '==', session.user.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach(async doc => {
                    await deleteDoc(doc.ref);
                });
            }
        } else {
            setCart([]);
            localStorage.removeItem('cart');
        }
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, decrementCartItem, incrementCartItem, clearCart, setCart }}>
            {children}
        </CartContext.Provider>
    );
};
