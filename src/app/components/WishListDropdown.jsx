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
                <div className="block select-none md:hidden" ref={wishlistRef}>
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
                    <div className={`rounded-md flex flex-col transition-all overflow-x-hidden overflow-y-auto absolute top-0 left-24 bg-white shadow-md min-w-56 w-content z-50 ${wishlistOpen ? 'border max-h-96 p-4 pb-2 opacity-100' : 'max-h-0 p-0 opacity-0'}`}>
                        {wishlist.length > 0 ? (
                            <>
                                <button onClick={moveToCart} className="sticky top-0 inline-block text-green-500 bg-white border border-green-500 px-2 py-1 text-sm rounded-full hover:bg-green-500 hover:text-white transition-all hover:shadow">Move to Cart</button>
                                <ul className={`transition-all mt-4 ${wishlistOpen ? 'text-indigo-500' : ''}`}>
                                    {wishlist.map(item => (
                                        <li key={item.slug} className="w-full mb-2  border-b">
                                            <Link href={`/products/${item.slug}`}>
                                                <div className="flex items-center w-full">
                                                    <Image src={item.image} alt={item.name} className="object-cover mr-2" width={40} height={40} />
                                                    <p className="hover:underline hover:text-indigo-900">{item.name}</p>
                                                </div>
                                            </Link>
                                            <div className="flex justify-between">
                                                <p>${item.price}</p>
                                                <button onClick={() => handleDeleteItem(item.slug)}>
                                                    <FontAwesomeIcon icon={faTimes} className="hover:text-red-600" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-2 flex flex-col gap-2 w-full">
                                    <Link href={!isAuthenticated ? "/visitor/wishlist" : "/account/wishlist"}>
                                        <p className="inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all hover:shadow w-full text-center">Go to Wishlist</p>
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
        </>
    );
}
