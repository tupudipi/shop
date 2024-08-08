'use client'
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import ProductCard from './ProductCard'; 

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const ordersQuery = query(
          collection(db, 'Orders'),
          where('created_at', '>=', Timestamp.fromDate(lastMonth))
        );

        const ordersSnapshot = await getDocs(ordersQuery);
        const productSales = {};

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
          throw new Error("No best-selling products found in the last month.");
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

  if (loading) {
    return <p className="text-center py-8">Loading best-sellers...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
