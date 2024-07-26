'use client';

import { useState, useRef, useContext, useEffect } from "react";
import { faShoppingCart, faAngleDown, faTimes, faAngleRight, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useOutsideClick from "./useOutsideClick";
import Link from "next/link";
import Image from "next/image";
import { CartContext } from '@/context/CartContext';
import { useSession } from "next-auth/react";
import { createPortal } from 'react-dom';

export default function CartDropdown(props) {
    const { cart, removeFromCart, decrementCartItem, clearCart } = useContext(CartContext);
    const [cartOpen, setCartOpen] = useState(false);
    const cartRef = useRef(null);
    const { data: session, status } = useSession();

    useOutsideClick(cartRef, () => {
        setCartOpen(false);
    });

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const isAuthenticated = session && status === 'authenticated';

    return (
        <>
            {props.navbar &&
                <div className="hidden md:block relative select-none" ref={cartRef}>
                    <div
                        className="cursor-pointer hover:text-indigo-950 transition-all flex items-center gap-1"
                        onClick={() => setCartOpen(!cartOpen)}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} className="max-h-4" /> {totalItems > 0 &&
                            <span className="absolute -top-2 -left-2 p-0.5 bg-emerald-500/75 group-hover:bg-emerald-500 text-white text-xs font-bold rounded-full">{totalItems}</span>
                        }
                        Cart
                        <FontAwesomeIcon icon={faAngleDown} className={`max-h-4 transition-transform ${cartOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {
                        <div className={`rounded-md flex flex-col items-center transition-all overflow-x-hidden overflow-y-auto absolute top-8 right-0 bg-white shadow-md w-content z-50 ${cartOpen ? 'max-h-96 p-4 pb-2' : 'max-h-0 p-0'}`}>
                            {cart.length > 0 ? (
                                <>
                                    <Link className="sticky top-0" href={!isAuthenticated ? "/visitor/cart" : "/account/cart"}>
                                        <p className="sticky top-0 mb-2 inline-block bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-all hover:shadow">Go to Checkout</p>
                                    </Link>
                                    <ul className={`transition-all ${cartOpen ? 'text-indigo-500' : ''}`}>
                                        {cart.map(item => (
                                            <li key={item.slug} className="flex justify-between items-center mb-2 gap-5 border-b-2 pb-1">
                                                <Link href={`/products/${item.slug}`}>
                                                    <div className="flex items-center">
                                                        <Image src={item.image} alt={item.name} className="object-cover mr-2" width={40} height={40} />
                                                        <p className="hover:underline hover:text-indigo-900 w-40">{item.name}</p>
                                                    </div>
                                                </Link>
                                                <p>${item.price} x {item.quantity}</p>
                                                <div className="flex gap-4">
                                                    <button onClick={() => decrementCartItem(item.slug)}>
                                                        <FontAwesomeIcon icon={faMinus} className="hover:text-red-600" />
                                                    </button>
                                                    <button onClick={() => removeFromCart(item.slug)}>
                                                        <FontAwesomeIcon icon={faTimes} className="hover:text-red-600" />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="text-center">
                                        <p className="mt-2">Total: ${total.toFixed(2)}</p>
                                        {cart.length > 5 ?
                                            (<button onClick={clearCart} className="inline-block text-red-500 bg-white border border-red-500 px-2 py-1 text-sm rounded-full hover:bg-red-500 hover:text-white transition-all hover:shadow">Clear Cart</button>) :
                                            (<></>)}
                                    </div>
                                </>
                            ) : (
                                <p className={`p-2 text-center transition-all ${cartOpen ? ('opacity-100') : ('opacity-0')}`}>Your cart is empty.</p>
                            )}
                        </div>
                    }
                </div>
            }

            {props.sidebar &&
                <div className="block md:hidden relative select-none">
                    <div
                        className="cursor-pointer hover:text-indigo-950 transition-all"
                        onClick={() => setCartOpen(!cartOpen)}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} /> {totalItems > 0 &&
                            <span className="absolute -top-2 -left-2 p-0.5 bg-emerald-500/75 group-hover:bg-emerald-500 text-white text-xs font-bold rounded-full">{totalItems}</span>
                        }
                        Cart <FontAwesomeIcon icon={faAngleRight} className={`max-h-4 transition-transform ${cartOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {cartOpen && typeof window !== 'undefined' && createPortal(
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center" onClick={() => setCartOpen(false)}>
                            <div className="bg-white rounded-lg w-11/12 max-w-md h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                                <div className="p-4 border-b">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold">Cart</h2>
                                        <button onClick={() => setCartOpen(false)} className="text-gray-500 hover:text-gray-700">
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                    {cart.length > 5 &&
                                        <button onClick={clearCart} className="mt-2 w-full text-red-500 bg-white border border-red-500 px-2 py-1 text-sm rounded-full hover:bg-red-500 hover:text-white transition-all hover:shadow">Clear Cart</button>
                                    }
                                </div>
                                <div className="flex-grow overflow-y-auto p-4">
                                    {cart.length > 0 ? (
                                        <ul>
                                            {cart.map(item => (
                                                <li key={item.slug} className="flex justify-between items-center mb-2 gap-2 border-b pb-2">
                                                    <Link href={`/products/${item.slug}`}>
                                                        <div className="flex items-center">
                                                            <Image src={item.image} alt={item.name} className="object-cover mr-2" width={40} height={40} />
                                                            <p className="hover:underline hover:text-indigo-900 w-20">{item.name}</p>
                                                        </div>
                                                    </Link>
                                                    <p>${item.price} x {item.quantity}</p>
                                                    <div>
                                                        <button onClick={() => decrementCartItem(item.slug)} className="mr-2">
                                                            <FontAwesomeIcon icon={faMinus} className="hover:text-red-600" />
                                                        </button>
                                                        <button onClick={() => removeFromCart(item.slug)}>
                                                            <FontAwesomeIcon icon={faTimes} className="hover:text-red-600" />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-center">Your cart is empty.</p>
                                    )}
                                </div>
                                {cart.length > 0 && (
                                    <div className="p-4 border-t">
                                        <p className="mb-2">Total: ${total.toFixed(2)}</p>
                                        <Link href={!isAuthenticated ? "/visitor/cart" : "/account/cart"}>
                                            <p className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all hover:shadow w-full text-center">Go to Checkout</p>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>,
                        document.getElementById('modal-root')
                    )}
                </div>
            }
        </>
    );
}
