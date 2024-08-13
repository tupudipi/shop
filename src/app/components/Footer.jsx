import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="bg-white shadow-lg mt-8 fixed w-full bottom-0 z-[-50]">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between space-y-8 md:space-y-0">
                <div className="flex flex-col items-start space-y-4 md:max-w-xs">
                    <div className="flex gap-8 md:gap-4 items-center">
                        <Image
                            src="/images/logo.png" 
                            alt="CicoShop Logo"
                            width={80}
                            height={80}
                        />
                        <h2 className="text-2xl font-bold">CicoShop</h2>
                    </div>

                    <p className="text-gray-600 text-sm">
                        CicoShop is a premium destination for the latest fashion trends. We offer a wide selection of merch, clothing, and accessories. Handpicked by your favorite fluffy cat, Cico himself.
                    </p>
                </div>

                <div className="flex justify-between sm:space-x-12">
                    <div className="flex flex-col space-y-4">
                        <h3 className="text-lg font-semibold">Categories</h3>
                        <Link href="/search/shirts" className="text-gray-600 hover:text-gray-900 transition-colors">Shirts</Link>
                        <Link href="/search/hoodies" className="text-gray-600 hover:text-gray-900 transition-colors">Hoodies</Link>
                        <Link href="/search/jackets" className="text-gray-600 hover:text-gray-900 transition-colors">Jackets</Link>
                        <Link href="/search/bags" className="text-gray-600 hover:text-gray-900 transition-colors">Bags</Link>
                        <Link href="/search/stickers" className="text-gray-600 hover:text-gray-900 transition-colors">Stickers</Link>
                        <Link href="/search/other" className="text-gray-600 hover:text-gray-900 transition-colors">Other</Link>
                    </div>

                    <div className="flex flex-col space-y-4 sm:mt-0">
                        <h3 className="text-lg font-semibold">About Us</h3>
                        <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">Our Story</Link>
                        <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</Link>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 text-gray-500 text-center py-4">
                © {new Date().getFullYear()} CicoShop. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
