// components/HeroSection.js
import Link from 'next/link';

export default function HeroSection() {
    return (
        <div className="relative w-full h-[80vh] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-image.jpg')" }}>
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">Discover the Best Deals</h1>
                <p className="text-lg md:text-2xl mb-6">Shop the latest trends at unbeatable prices</p>
                <Link href="/search" className="px-8 py-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition duration-300">
                    Shop Now
                </Link>
            </div>
        </div>
    );
}
