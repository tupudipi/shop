'use client'

import { useState, useRef } from "react";
import { faShoppingCart, faAngleDown, faTimes, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useOutsideClick from "./useOutsideClick";
import Link from "next/link";
import Image from "next/image";

export default function CartDropdown(props) {
    const [cartOpen, setCartOpen] = useState(false);
    const cartRef = useRef(null);

    useOutsideClick(cartRef, () => {
        setCartOpen(false);
    });

    // Dummy cart items
    const cartItems = [
        { id: 1, image: '/path/to/image1.jpg', name: 'Item A', price: '$100' },
        { id: 2, image: '/path/to/image2.jpg', name: 'Item B', price: '$200' },
    ];

    return (
        <>
            {props.navbar &&
                <div className="hidden md:block relative select-none" ref={cartRef}>
                    <div
                        className="cursor-pointer hover:text-indigo-950 transition-all flex items-center gap-1"
                        onClick={() => setCartOpen(!cartOpen)}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} className="max-h-4" /> {cartItems.length > 0 &&
                            <span className="absolute -top-2 -left-2 p-0.5 bg-emerald-500/75 group-hover:bg-emerald-500 text-white text-xs font-bold rounded-full">{cartItems.length}</span>
                        }
                        Cart
                        <FontAwesomeIcon icon={faAngleDown} className={`max-h-4 transition-transform ${cartOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {
                        <div className={`rounded-md flex flex-col items-center transition-all overflow-hidden absolute top-8 right-0 bg-white shadow-md w-content z-50 ${cartOpen ? 'max-h-96 p-4 pb-2' : 'max-h-0 p-0'}`}>
                            {/* Add cart items here */}
                            <ul className={`transition-all ${cartOpen ? '`text-indigo-500' : ''}`}>
                                {cartItems.map(item => (
                                    <li key={item.id} className="flex justify-between items-center mb-2 gap-5 border-b-2 pb-1">
                                        <Link href={`/products/${item.id}`}>
                                            <div className="flex items-center">
                                                <Image src={item.image} alt={item.name} className="object-cover mr-2" width={'40'} height={'40'} />
                                                <p className="hover:underline hover:text-indigo-900 w-40">{item.name}</p>
                                            </div>
                                        </Link>
                                        <p>{item.price}</p>
                                        <button onClick={() => {/* handle delete item */ }}>
                                            <FontAwesomeIcon icon={faTimes} className="hover:text-red-600" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-2">Total: ${cartItems.reduce((total, item) => total + Number(item.price.replace('$', '')), 0)}</p>
                            <Link href="/cart">
                                <p className="mt-2 inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all hover:shadow">Go to Cart</p>
                            </Link>
                        </div>
                    }
                </div>
            }

            {props.sidebar &&
                <div className="block md:hidden relative select-none" ref={cartRef}>
                    <div
                        className="cursor-pointer hover:text-indigo-950 transition-all"
                        onClick={() => setCartOpen(!cartOpen)}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} /> {cartItems.length > 0 &&
                            <span className="absolute -top-2 -left-2 p-0.5 bg-emerald-500/75 group-hover:bg-emerald-500 text-white text-xs font-bold rounded-full">{cartItems.length}</span>
                        }
                        Cart <FontAwesomeIcon icon={faAngleRight} className={`max-h-4 transition-transform ${cartOpen ? 'rotate-180' : ''}`}/>
                    </div>
                    {
                        <div className={`rounded-md flex flex-col items-center transition-all overflow-hidden absolute top-0 left-28 bg-white shadow-md w-content z-50 ${cartOpen ? 'border max-h-96 p-4 pb-2 opacity-100' : 'max-h-0 p-0 opacity-0'}`}>
                            {/* Add cart items here */}
                            <ul className={`transition-all ${cartOpen ? '`text-indigo-500' : ''}`}>
                                {cartItems.map(item => (
                                    <li key={item.id} className="flex justify-between items-center mb-2 gap-5 border-b-2 pb-1">
                                        <Link href={`/products/${item.id}`}>
                                            <div className="flex items-center">
                                                <Image src={item.image} alt={item.name} className="object-cover mr-2" width={'40'} height={'40'} />
                                                <p className="hover:underline hover:text-indigo-900 w-20">{item.name}</p>
                                            </div>
                                        </Link>
                                        <p>{item.price}</p>
                                        <button onClick={() => {/* handle delete item */ }}>
                                            <FontAwesomeIcon icon={faTimes} className="hover:text-red-600" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-2">Total: ${cartItems.reduce((total, item) => total + Number(item.price.replace('$', '')), 0)}</p>
                            <Link href="/cart">
                                <p className="mt-2 inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all hover:shadow">Go to Cart</p>
                            </Link>
                        </div>
                    }
                </div>
            }
        </>
    );
};