'use client'

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();
    return (
        <div className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0">
            <h1 className="text-xl font-medium capitalize">
                {pathname === '/admin' ? 'Dashboard' : `Manage ${pathname.split('/').pop()}`}</h1>
            <Link href="/" className="flex items-center text-blue-500">
                Go to Website <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 max-w-5 max-h-5" />
            </Link>
        </div>
    );
};

export default Navbar;
