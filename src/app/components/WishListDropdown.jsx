'use client';

import { useState, useRef, useContext, useEffect } from "react";
import { faHeart, faAngleDown, faTimes, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useOutsideClick from "./useOutsideClick";
import Link from "next/link";
import Image from "next/image";
import { WishlistContext } from "@/context/WishlistContext";
import { useSession } from "next-auth/react";
import { CartContext } from "@/context/CartContext";
import { createPortal } from 'react-dom';

export default function WishlistDropdown(props) {
    const { data: session, status } = useSession();
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const wishlistRef = useRef(null);
    useOutsideClick(wishlistRef, () => {
        setWishlistOpen(false);
    });
    const { wishlist, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
    const { cart, addToCart, setCart } = useContext(CartContext);
    const handleDeleteItem = (slug) => {
        removeFromWishlist(slug);
    };

    const moveToCart = () => {
        const tempCart = [...cart];

        for (const item of wishlist) {
            const existingProductIndex = tempCart.findIndex(cartItem => cartItem.slug === item.slug);

            if (existingProductIndex !== -1) {
                tempCart[existingProductIndex] = {
                    ...tempCart[existingProductIndex],
                    quantity: (tempCart[existingProductIndex].quantity || 1) + (item.quantity || 1)
                };
            } else {
                tempCart.push({ ...item, quantity: item.quantity || 1 });
            }
        }

        setCart(tempCart);
        localStorage.setItem('cart', JSON.stringify(tempCart));
    };


    const isAuthenticated = session && status === 'authenticated';
    return (
        <>
            {props.navbar &&
                <div className="hidden relative select-none md:block" ref={wishlistRef}>
                    <div className="group cursor-pointer hover:text-indigo-950 transition-all flex items-center gap-1"
                        onClick={() => setWishlistOpen(!wishlistOpen)}
                    >
                        <FontAwesomeIcon icon={faHeart} className="max-h-4" />
                        {wishlist.length > 0 &&
                            <span className="absolute -top-2 -left-2 p-0.5 bg-red-500/75 group-hover:bg-red-500 text-white text-xs font-bold rounded-full">{wishlist.length}</span>
                        }
                        Wishlist
                        <FontAwesomeIcon icon={faAngleDown} className={`max-h-4 transition-transform ${wishlistOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <div className={`rounded-md flex flex-col items-center transition-all overflow-x-hidden overflow-y-auto absolute top-8 right-0 bg-white shadow-md w-content min-w-36 z-50 ${wishlistOpen ? 'max-h-96 p-4 pb-2' : 'max-h-0 p-0'}`}>
                        {wishlist.length > 0 ? (
                            <>
                                <button onClick={moveToCart} className="sticky top-0 inline-block text-green-500 bg-white border border-green-500 px-2 py-1 text-sm rounded-full hover:bg-green-500 hover:text-white transition-all hover:shadow">Move to Cart</button>
                                <ul className={`transition-all ${wishlistOpen ? 'text-indigo-500' : ''}`}>
                                    {wishlist.map(item => (
                                        <li key={item.slug} className="flex justify-between items-center mb-2 gap-5 border-b-2 pb-1">
                                            <Link href={`/products/${item.slug}`}>
                                                <div className="flex items-center">
                                                    <Image src={item.image} alt={item.name} className="object-cover mr-2" width={40} height={40} />
                                                    <p className="hover:underline hover:text-indigo-900 w-40">{item.name}</p>
                                                </div>
                                            </Link>
                                            <p>${item.price}</p>
                                            <button onClick={() => handleDeleteItem(item.slug)}>
                                                <FontAwesomeIcon icon={faTimes} className="hover:text-red-600" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-2 flex justify-between w-full">
                                    <Link href={!isAuthenticated ? "/visitor/wishlist" : "/account/wishlist"}>
                                        <p className="inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all hover:shadow">Go to Wishlist</p>
                                    </Link>
                                    <button onClick={clearWishlist} className="inline-block text-red-500 bg-white border border-red-500 px-2 py-1 text-sm rounded-full hover:bg-red-500 hover:text-white transition-all hover:shadow">Clear Wishlist</button>
                                </div>
                            </>
                        ) : (
                            <p className={`p-2 text-center transition-all ${wishlistOpen ? 'opacity-100' : 'opacity-0'}`}>Your wishlist is empty.</p>
                        )}
                    </div>
                </div>
            }
            
            {props.sidebar &&
                <div className="block relative select-none md:hidden">
                    <div className="group cursor-pointer hover:text-indigo-950 transition-all flex items-center gap-1"
                        onClick={() => setWishlistOpen(!wishlistOpen)}
                    >
                        <FontAwesomeIcon icon={faHeart} className="max-h-4" />
                        {wishlist.length > 0 &&
                            <span className="absolute -top-2 -left-2 p-0.5 bg-red-500/75 group-hover:bg-red-500 text-white text-xs font-bold rounded-full">{wishlist.length}</span>
                        }
                        Wishlist
                        <FontAwesomeIcon icon={faAngleRight} className={`max-h-4 transition-transform ${wishlistOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {wishlistOpen && typeof window !== 'undefined' && createPortal(
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center" onClick={() => setWishlistOpen(false)}>
                            <div className="bg-white rounded-lg w-11/12 max-w-md h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                                <div className="p-4 border-b">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold">Wishlist</h2>
                                        <button onClick={() => setWishlistOpen(false)} className="text-gray-500 hover:text-gray-700">
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                    <button onClick={moveToCart} className="mt-2 w-full text-green-500 bg-white border border-green-500 px-2 py-1 text-sm rounded-full hover:bg-green-500 hover:text-white transition-all hover:shadow">Move to Cart</button>
                                </div>
                                <div className="flex-grow overflow-y-auto p-4">
                                    {wishlist.length > 0 ? (
                                        <ul>
                                            {wishlist.map(item => (
                                                <li key={item.slug} className="mb-2 border-b pb-2">
                                                    <Link href={`/products/${item.slug}`}>
                                                        <div className="flex items-center w-full">
                                                            <Image src={item.image} alt={item.name} className="object-cover mr-2" width={40} height={40} />
                                                            <p className="hover:underline hover:text-indigo-900">{item.name}</p>
                                                        </div>
                                                    </Link>
                                                    <div className="flex justify-between mt-1">
                                                        <p>${item.price}</p>
                                                        <button onClick={() => handleDeleteItem(item.slug)}>
                                                            <FontAwesomeIcon icon={faTimes} className="hover:text-red-600" />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-center">Your wishlist is empty.</p>
                                    )}
                                </div>
                                {wishlist.length > 0 && (
                                    <div className="p-4 border-t">
                                        <Link href={!isAuthenticated ? "/visitor/wishlist" : "/account/wishlist"}>
                                            <p className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all hover:shadow w-full text-center">Go to Wishlist</p>
                                        </Link>
                                        <button onClick={clearWishlist} className="mt-2 w-full text-red-500 bg-white border border-red-500 px-2 py-1 text-sm rounded-full hover:bg-red-500 hover:text-white transition-all hover:shadow">Clear Wishlist</button>
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
