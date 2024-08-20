'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import WishListDrowpdown from './WishListDropdown';
import CartDropdown from './CartDropdown';
import LoginButton from './LoginButton';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Search from './Search';

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
        <div className={`fixed left-0 top-[44px] md:top-14 h-screen w-64 bg-slate-100 p-4 flex flex-col z-40 transition-transform duration-200 ease-in-out overflow-y-auto ${sidebarOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`}>
            {session ? (
                <div>
                    <Link href='/account' >
                        <div className='hover:text-blue-950 transition-all mb-2'>
                            <div className='flex gap-1'>
                                <Image width={24} height={24} alt='User' src={session.user.image} />
                                <p className='mb-1'>{session.user.name}</p>
                            </div>
                        </div>
                    </Link>
                    <hr className='border-2 text-slate-600 rounded-full'></hr>
                </div>
            ) : (
                <div>
                    <Link href='/visitor' >
                        <div className='hover:text-blue-950 transition-all mb-2'>
                            <div className='flex gap-1 items-baseline'>
                                <FontAwesomeIcon icon={faUser} />
                                <p className='mb-1'>Visitor Account</p>
                            </div>
                        </div>
                    </Link>
                    <hr className='border-2 text-slate-600 rounded-full'></hr>
                </div>
            )}
            <ul className='flex flex-col gap-2 mt-2'>
                <Link href='/search' className='hover:text-blue-950 transition-all'>All products</Link>
                <hr></hr>
                {categories.map((category) => (
                    <li className='flex hover:text-blue-950 transition-all' key={category.category_name}>
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
        <div id="cover" className={`fixed left-0 top-[44px] md: top-[56px] h-full w-full bg-blue-950/50 z-30 ${sidebarOpen ? 'block' : 'hidden'}`} onClick={closeSidebar}></div>
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

    useEffect(() => {
        if (sidebarOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [sidebarOpen]);

    return (
        <nav className="text-blue-800 bg-slate-100 z-[49] sticky top-0">
            <div className="px-4 py-2 mx-auto md:flex md:items-center">
                <div className="flex justify-between w-full">
                    <div className="flex items-center gap-2">
                        <div
                            className="cursor-pointer hover:text-blue-950 transition-all"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
                        </div>
                        <Link href="/" className="font-bold text-xl">Cico Shop</Link>
                    </div>
                    <div className='flex-1 md:px-4 hidden md:block'>
                        <Search closeSidebar={() => setSidebarOpen(false)}/>
                    </div>
                    <div className="flex justify-end gap-5 items-center">
                        <WishListDrowpdown navbar />
                        <CartDropdown navbar />
                        <LoginButton />
                    </div>
                </div>
                <div className="mt-2 relative">
                    <Sidebar closeSidebar={() => setSidebarOpen(false)} sidebarOpen={sidebarOpen} categories={categories} />
                    <div className='md:hidden'>
                        <Search closeSidebar={() => setSidebarOpen(false)}/>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;