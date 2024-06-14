'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import WishListDrowpdown from './WishListDropdown';
import CartDropdown from './CartDropdown';
import LoginButton from './LoginButton';
import { useSession } from 'next-auth/react';

async function getCategories() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }
    return res.json();
}

const Sidebar = ({ closeSidebar, sidebarOpen, categories }) => {
    const { data: session } = useSession();
    return (<>
        <div className={`fixed left-0 h-full w-64 bg-white p-4 flex flex-col z-40 transition-transform duration-200 ease-in-out ${sidebarOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`}>
            {session && (
                <span>
                    <Link href='/account' className='hover:text-indigo-950 transition-all flex gap-2 items-center'><FontAwesomeIcon icon={faUser} /> Account</Link>
                    <hr className='border-2 text-slate-600 rounded-full'></hr>
                </span>
            )}
            <ul className='flex flex-col gap-2 mt-2'>
                {categories.map((category) => (
                    <li className='flex hover:text-indigo-950 transition-all' key={category.category_name}>
                        <Link href={`/search/${category.category_name}`} className='w-full'>{category.category_name}</Link>
                    </li>
                ))}
            </ul>
            <hr className='border-2 text-slate-600 rounded-full my-2'></hr>
            <div className='flex flex-col gap-2 mt-2'>
                <WishListDrowpdown sidebar />
                <CartDropdown sidebar />
            </div>
        </div>
        <div id="cover" className={`fixed left-0 h-full w-full bg-indigo-950/50 z-30 ${sidebarOpen ? 'block' : 'hidden'}`} onClick={closeSidebar}></div>
    </>
    )
}

const Navbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories()
            .then(data => {
                setCategories(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    return (
        <nav className="text-indigo-800">
            <div className="px-4 py-2 container mx-auto">
                <div className="flex justify-between align-middle">
                    <div className="flex items-center gap-2">
                        <div
                            className="cursor-pointer hover:text-indigo-950 transition-all"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
                        </div>
                        <Link href="/" className="font-bold text-xl">Cico Shop</Link>
                    </div>
                    <div className="flex justify-end gap-5 items-center">
                        <WishListDrowpdown navbar />
                        <CartDropdown navbar />
                        <LoginButton />
                    </div>
                </div>
                <div className="mt-2 relative">
                    <Sidebar closeSidebar={() => setSidebarOpen(false)} sidebarOpen={sidebarOpen} categories={categories} />
                    <input className="w-full p-2 px-4 rounded-full pr-0 shadow active:shadow-md" type="search" placeholder="Search..." />
                    <div
                        className="absolute top-1/2 transform -translate-y-1/2 right-0 h-5 w-5 text-gray-500 flex items-center justify-center cursor-pointer hover:bg-sky-100 p-5 rounded-r-full hover:text-indigo-900 transition-all"
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;