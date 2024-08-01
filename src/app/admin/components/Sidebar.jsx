'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAddressBook, faList, faShoppingCart, faBoxOpen, faStar, faUsers, faHeart, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const collections = [
    { name: 'Dashboard', icon: faHome, path: '/admin' },
    { name: 'Addresses', icon: faAddressBook, path: '/admin/addresses' },
    { name: 'Categories', icon: faList, path: '/admin/categories' },
    { name: 'Orders', icon: faShoppingCart, path: '/admin/orders' },
    { name: 'Products', icon: faBoxOpen, path: '/admin/products' },
    { name: 'Reviews', icon: faStar, path: '/admin/reviews' },
    { name: 'Users', icon: faUsers, path: '/admin/users' },
    { name: 'Wishlists', icon: faHeart, path: '/admin/wishlists' },
    { name: 'Carts', icon: faCartPlus, path: '/admin/carts' },
];

const Sidebar = () => {
    const pathname = usePathname();

    const isActive = (path) => {
        if (path === '/admin/dashboard') {
            return pathname === '/admin' || pathname === '/admin/' || pathname === path;
        }
        return pathname === path;
    };

    return (
        <div className="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto z-10">
            <h1 className="text-xl font-semibold p-6 pt-4">Cico Shop Admin</h1>
            <nav>
                <ul className="space-y-2 px-4">
                    {collections.map((collection) => (
                        <li key={collection.name}>
                            <Link 
                                href={collection.path} 
                                className={`flex items-center py-3 px-4 rounded-lg transition-colors duration-200 ${
                                    isActive(collection.path)
                                        ? 'bg-gray-700 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <FontAwesomeIcon icon={collection.icon} className="w-5 h-5 mr-3" />
                                <span>{collection.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;