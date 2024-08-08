// pages/index.js
import HeroSection from './components/HeroSection';
import FeaturedCategories from './components/FeaturedCategories';
import BestSellers from './components/BestSellers';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <main className="flex flex-col items-center">
        <section className="w-full py-8">
          <h2 className="text-3xl font-bold text-center mb-6">Featured Categories</h2>
          <FeaturedCategories />
        </section>
        <section className="w-full py-8">
          <h2 className="text-3xl font-bold text-center mb-6">Best Sellers</h2>
          <BestSellers />
        </section>
      </main>
    </>
  );
}
