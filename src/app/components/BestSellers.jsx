'use client'
import { useEffect, useState, useRef } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import ProductCard from './ProductCard';
import ProductLoading from './ProductLoading';

const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const scrollContainer = useRef(null);

  const handleResize = debounce(() => {
    setIsSmallScreen(window.innerWidth < 1280);
  }, 250);

  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 1280);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    const handleWheel = (event) => {
      if (isSmallScreen) {
        event.preventDefault();
        if (scrollContainer.current) {
          scrollContainer.current.scrollLeft += event.deltaY;
        }
      }
    };

    const container = scrollContainer.current;
    if (isSmallScreen && container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (isSmallScreen && container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isSmallScreen]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        let ordersQuery;
        let ordersSnapshot;
        let productSales = {};

        // First, try to fetch data from the last month
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        ordersQuery = query(
          collection(db, 'Orders'),
          where('created_at', '>=', Timestamp.fromDate(lastMonth))
        );
        ordersSnapshot = await getDocs(ordersQuery);

        // If no results, fetch all-time data
        if (ordersSnapshot.empty) {
          ordersQuery = query(collection(db, 'Orders'));
          ordersSnapshot = await getDocs(ordersQuery);
        }

        ordersSnapshot.forEach((orderDoc) => {
          const orderData = orderDoc.data();
          orderData.products.forEach((product) => {
            const productSlug = product.slug;
            productSales[productSlug] = (productSales[productSlug] || 0) + 1;
          });
        });

        const sortedProductSlugs = Object.entries(productSales)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 8)
          .map(([slug]) => slug);

        if (sortedProductSlugs.length === 0) {
          throw new Error("No best-selling products found.");
        }

        const productsQuery = query(
          collection(db, 'Products'),
          where('slug', 'in', sortedProductSlugs)
        );
        const productsSnapshot = await getDocs(productsQuery);
        const fetchedProducts = [];
        productsSnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() });
        });

        setProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching best-selling products:", err);
        setError("Failed to load best-selling products.");
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  if (error) {
    return <p className="text-center py-8 text-red-500">{error}</p>;
  }

  return (
    <div className="my-6 flex w-full items-center">
      <div
        ref={scrollContainer}
        className="flex gap-3 md:gap-6 max-w-[22rem] md:max-w-3xl overflow-x-auto pb-6 lg:max-w-5xl xl:max-w-7xl mb-2 self-center mx-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        {loading ? (
          <><ProductLoading /> <ProductLoading /> <ProductLoading /></>
        ) : (
          <>
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}