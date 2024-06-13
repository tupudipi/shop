'use client';

import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    const addToCart = (product) => {
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
    };

    const decrementCartItem = (slug) => {
        const updatedCart = cart
            .map(item =>
                item.slug === slug ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter(item => item.quantity > 0);

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeFromCart = (slug) => {
        const updatedCart = cart.filter(item => item.slug !== slug);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, decrementCartItem }}>
            {children}
        </CartContext.Provider>
    );
};
