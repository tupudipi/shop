'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AccountSidebar = () => {
    const pathname = usePathname();
    console.log(pathname);

    const links = [
        { href: '/account', text: 'Account Overview' },
        { href: '/account/delivery-billing', text: 'Delivery and Billing Details' },
        { href: '/account/orders', text: 'Order History' },
        { href: '/account/wishlist', text: 'Wishlist' },
        { href: '/account/reviews', text: 'Reviews' },
    ];

    return (
        <ul className="bg-white p-2 rounded-lg border-2 border-indigo-800/60">
            {links.map((link, index) => (
                <Link key={index} href={link.href}>
                    <li className={`my-1 p-2 hover:bg-indigo-200/75 cursor-pointer rounded-md transition-all hover:shadow ${pathname === link.href ? 'border-l-4 border-indigo-400 bg-indigo-50' : ''}`}>
                        {link.text}
                    </li>
                </Link>
            ))}
        </ul>
    );
};

export default AccountSidebar;