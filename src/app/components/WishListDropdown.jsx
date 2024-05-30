'use client'

import { useState, useRef } from "react";
import { faHeart, faAngleDown, faTimes, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useOutsideClick from "./useOutsideClick";
import Link from "next/link";
import Image from "next/image";

function getWishlist() {
    let wishlist = localStorage.getItem('wishlist');
    if (wishlist) {
        return JSON.parse(wishlist);
    } else {
        return [];
    }
}

export default function WishlistDropdown(props) {
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const wishlistRef = useRef(null);

    useOutsideClick(wishlistRef, () => {
        setWishlistOpen(false);
    });

    const wishlistItems = getWishlist();

    return (
        <>
            {props.navbar &&
                <div className="hidden relative select-none md:block" ref={wishlistRef}>
                    {
                        <div className="group cursor-pointer hover:text-indigo-950 transition-all flex items-center gap-1"
                            onClick={() => setWishlistOpen(!wishlistOpen)}
                        >
                            <FontAwesomeIcon icon={faHeart} className="max-h-4" />
                            {wishlistItems.length > 0 &&
                                <span className="absolute -top-2 -left-2 p-0.5 bg-red-500/75 group-hover:bg-red-500 text-white text-xs font-bold rounded-full">{wishlistItems.length}</span>
                            }
                            Wishlist
                            <FontAwesomeIcon icon={faAngleDown} className={`max-h-4 transition-transform ${wishlistOpen ? 'rotate-180' : ''}`} />
                        </div>
                    }
                    {
                        <div className={`rounded-md flex flex-col items-center transition-all overflow-hidden absolute top-8 right-0 bg-white shadow-md w-content min-w-36 z-50 ${wishlistOpen ? 'max-h-96 p-4 pb-2' : 'max-h-0 p-0'}`}>
                            <ul className={`transition-all ${wishlistOpen ? '`text-indigo-500' : ''}`}>
                                {wishlistItems.map(item => (
                                    // console.log(item),
                                    <li key={item.slug} className="flex justify-between items-center mb-2 gap-5 border-b-2 pb-1">
                                        <Link href={`/products/${item.slug}`}>
                                            <div className="flex items-center">
                                                <Image src={item.image} alt={item.name} className="object-cover mr-2" width={'40'} height={'40'} />
                                                <p className="hover:underline hover:text-indigo-900 w-40">{item.name}</p>
                                            </div>
                                        </Link>
                                        <p>{item.price}</p>
                                        <button onClick={() => {/* handle delete item */ }}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {wishlistItems.length > 0 ? (
                                <Link href="/account/wishlist">
                                    <p className="mt-2 inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all hover:shadow">Go to Wishlist</p>
                                </Link>
                            ) : (
                                <p className="mt-2 text-center">Your wishlist is empty. Start adding your favourite products!</p>
                            )}
                        </div>
                    }
                </div>
            }

            {props.sidebar &&
                <div className="relative select-none md:hidden" ref={wishlistRef}>
                    {
                        <div className="group cursor-pointer hover:text-indigo-950 transition-all"
                            onClick={() => setWishlistOpen(!wishlistOpen)}
                        >
                            <FontAwesomeIcon icon={faHeart} />
                            {wishlistItems.length > 0 &&
                                <span className="absolute -top-2 -left-2 p-0.5 bg-red-500/75 group-hover:bg-red-500 text-white text-xs font-bold rounded-full">{wishlistItems.length}</span>
                            }
                            Wishlist <FontAwesomeIcon icon={faAngleRight} className={`max-h-4 transition-transform ${wishlistOpen ? 'rotate-180' : ''}`} />
                        </div>
                    }
                    {
                        <div className={`rounded-md flex flex-col items-center transition-all overflow-hidden absolute top-0 left-28 bg-white shadow-md w-content z-50 ${wishlistOpen ? 'border max-h-96 p-4 pb-2 opacity-100' : 'max-h-0 p-0 opacity-0'}`}>
                            {/* Add wishlist items here */}
                            <ul className={`transition-all ${wishlistOpen ? '`text-indigo-500' : ''}`}>
                                {wishlistItems.map(item => (
                                    <li key={item.id} className="flex justify-between items-center mb-2 gap-5 border-b-2 pb-1">
                                        <Link href={`/products/${item.id}`}>
                                            <div className="flex items-center">
                                                <Image src={item.image} alt={item.name} className="object-cover mr-2" width={'40'} height={'40'} />
                                                <p className="hover:underline hover:text-indigo-900 w-20">{item.name}</p>
                                            </div>
                                        </Link>
                                        <p>{item.price}</p>
                                        <button onClick={() => {/* handle delete item */ }}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/account/wishlist">
                                <p className="mt-2 inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all hover:shadow">Go to Wishlist</p>
                            </Link>
                        </div>
                    }
                </div>
            }
        </>
    );
};