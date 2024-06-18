'use client'

import { useState, useRef, useContext } from "react";
import { faHeart, faAngleDown, faTimes, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useOutsideClick from "./useOutsideClick";
import Link from "next/link";
import Image from "next/image";
import { WishlistContext } from "@/context/WishlistContext";

export default function WishlistDropdown(props) {
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const wishlistRef = useRef(null);

    useOutsideClick(wishlistRef, () => {
        setWishlistOpen(false);
    });

    const { wishlist, removeFromWishlist } = useContext(WishlistContext);

    const handleDeleteItem = (slug) => {
        removeFromWishlist(slug);
    };

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
                    <div className={`rounded-md flex flex-col items-center transition-all overflow-hidden absolute top-8 right-0 bg-white shadow-md w-content min-w-36 z-50 ${wishlistOpen ? 'max-h-96 p-4 pb-2' : 'max-h-0 p-0'}`}>
                        <ul className={`transition-all ${wishlistOpen ? 'text-indigo-500 opacity-100' : 'opacity-0'}`}>
                            {wishlist.map(item => (
                                <li key={item.slug} className="flex justify-between items-center mb-2 gap-5 border-b-2 pb-1">
                                    <Link href={`/products/${item.slug}`}>
                                        <div className="flex items-center">
                                            <Image src={item.image} alt={item.name} className="object-cover mr-2" width={'40'} height={'40'} />
                                            <p className="hover:underline hover:text-indigo-900 w-40">{item.name}</p>
                                        </div>
                                    </Link>
                                    <p>{item.price}</p>
                                    <button onClick={() => handleDeleteItem(item.slug)} className="hover:text-red-600">
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {wishlist.length > 0 ? (
                            <Link href="/account/wishlist">
                                <p className="mt-2 inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all hover:shadow">Go to Wishlist</p>
                            </Link>
                        ) : (
                            <p className={`mt-2 text-center transition-all ${wishlistOpen ? ('opacity-100') : ('opacity-0')}`}>Your wishlist is empty. Start adding your favourite products!</p>
                        )}
                    </div>
                </div>
            }

            {props.sidebar &&
                <div className="relative select-none md:hidden" ref={wishlistRef}>
                    <div className="group cursor-pointer hover:text-indigo-950 transition-all"
                        onClick={() => setWishlistOpen(!wishlistOpen)}
                    >
                        <FontAwesomeIcon icon={faHeart} className="mr-2"/>
                        {wishlist.length > 0 &&
                            <span className="absolute -top-2 -left-2 p-0.5 bg-red-500/75 group-hover:bg-red-500 text-white text-xs font-bold rounded-full">{wishlist.length}</span>
                        }
                        Wishlist <FontAwesomeIcon icon={faAngleRight} className={`max-h-4 transition-transform ${wishlistOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <div className={`rounded-md flex flex-col items-center transition-all overflow-hidden absolute top-0 left-28 bg-white shadow-md min-w-48 w-content z-50 ${wishlistOpen ? 'border max-h-96 p-4 pb-2 opacity-100' : 'max-h-0 p-0 opacity-0'}`}>
                        <ul className={`transition-all ${wishlistOpen ? 'text-indigo-500' : ''}`}>
                            {wishlist.map(item => (
                                <li key={item.slug} className="flex justify-between items-center mb-2 gap-5 border-b-2 pb-1">
                                    <Link href={`/products/${item.slug}`}>
                                        <div className="flex items-center">
                                            <Image src={item.image} alt={item.name} className="object-cover mr-2" width={'40'} height={'40'} />
                                            <p className="hover:underline hover:text-indigo-900 w-20">{item.name}</p>
                                        </div>
                                    </Link>
                                    <p>{item.price}</p>
                                    <button onClick={() => handleDeleteItem(item.slug)} className="hover:text-red-600">
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {wishlist.length > 0 ? (
                            <Link href="/account/wishlist">
                                <p className="mt-2 inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all hover:shadow">Go to Wishlist</p>
                            </Link>
                        ) : (
                            <p className={`mt-2 text-center transition-all ${wishlistOpen ? ('opacity-100') : ('opacity-0')}`}>Your wishlist is empty. Start adding your favourite products!</p>
                        )}
                    </div>
                </div>
            }
        </>
    );
};
