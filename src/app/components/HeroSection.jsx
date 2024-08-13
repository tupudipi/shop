import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <div className='relative flex gap-4 p-4 flex-col md:gap-8 md:flex-row md:items-center md:justify-center'>

            <div className='rounded-lg'>
                <Image
                    src='/images/hero-image.jpeg'
                    alt={'Cute cat shopping'}
                    className="rounded-lg"
                    width={400}
                    height={400}
                />
            </div>


            <div className="flex flex-col justify-center items-center text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">Discover the Best Deals</h1>
                <p className="text-lg md:text-2xl mb-6">Shop the latest trends at unbeatable prices</p>
                <Link href="/search" className="px-8 py-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition duration-300">
                    Shop Now
                </Link>
            </div>
        </div>
    );
}
