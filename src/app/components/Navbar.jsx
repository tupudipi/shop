'use client'

import { useState } from 'react';
import Link from 'next/link';

const Sidebar = ({ closeSidebar, sidebarOpen }) => {
    return (<>
        <div className={`fixed left-0 h-full w-64 bg-white p-4 flex flex-col z-40 transition-transform duration-200 ease-in-out ${sidebarOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`}>
            <Link href='/account' className='hover:text-indigo-950 transition-all'>Account</Link>
            <hr className='border-2 text-slate-600 rounded-full'></hr>
            <ul className='flex flex-col gap-2 mt-2'>
                <li className='flex hover:text-indigo-950 transition-all'><Link href='/search?cat=1' className='w-full'>Category 1</Link></li>
                <li className='flex hover:text-indigo-950 transition-all'><Link href='/search?cat=2' className='w-full'>Category 2</Link></li>
                <li className='flex hover:text-indigo-950 transition-all'><Link href='/search?cat=3' className='w-full'>Category 3</Link></li>
            </ul>
        </div>
        <div id="cover" className={`fixed left-0 h-full w-full bg-indigo-950/50 z-30 ${sidebarOpen ? 'block' : 'hidden'}`} onClick={closeSidebar}></div>
    </>
    )
}

const Navbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <nav className="text-indigo-800">
            <div className="p-4">
                <div className="flex justify-between align-middle">
                    <div className="flex items-center gap-2">
                        <div
                            className="cursor-pointer hover:text-indigo-950 transition-all"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? 'Close' : 'Menu'}
                        </div>
                        <Link href="/" className="font-bold text-xl">My App</Link>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Link className="cursor-pointer hover:text-indigo-950 transition-all" href="/login">Login</Link>
                        <Link className="cursor-pointer hover:text-indigo-950 transition-all" href="/register">Register</Link>
                        <div className="cursor-pointer hover:text-indigo-950 transition-all">Heart</div>
                        <div className="cursor-pointer hover:text-indigo-950 transition-all">Cart</div>
                    </div>
                </div>
                <div className="mt-2 relative">
                    <Sidebar closeSidebar={() => setSidebarOpen(false)} sidebarOpen={sidebarOpen} />
                    <input className="w-full p-2 px-4 rounded-full pr-0 shadow active:shadow-md" type="search" placeholder="Search..." />
                    <div
                        className="absolute top-1/2 transform -translate-y-1/2 right-0 h-5 w-5 text-gray-500 flex items-center justify-center cursor-pointer hover:bg-sky-100 p-5 rounded-r-full hover:text-indigo-900 transition-all"
                    >
                        icon
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;