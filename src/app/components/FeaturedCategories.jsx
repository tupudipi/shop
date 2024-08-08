'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from "@/firebaseInit";

export default function FeaturedCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedCategories = async () => {
            try {
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);

                const ordersQuery = query(
                    collection(db, 'Orders'),
                    where('created_at', '>=', Timestamp.fromDate(lastMonth))
                );

                const ordersSnapshot = await getDocs(ordersQuery);
                const categorySales = {};

                ordersSnapshot.forEach((orderDoc) => {
                    const orderData = orderDoc.data();
                    orderData.products.forEach((product) => {
                        const categoryName = product.category;
                        categorySales[categoryName] = (categorySales[categoryName] || 0) + 1;
                    });
                });

                const sortedCategories = Object.entries(categorySales)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 4)
                    .map(([category_name]) => category_name);

                if (sortedCategories.length === 0) {
                    throw new Error("No categories found with sales in the last month.");
                }

                const categoriesQuery = query(
                    collection(db, 'Categories'),
                    where('category_name', 'in', sortedCategories)
                );

                const categoriesSnapshot = await getDocs(categoriesQuery);
                const fetchedCategories = [];

                categoriesSnapshot.forEach((doc) => {
                    fetchedCategories.push({ id: doc.id, ...doc.data() });
                });

                setCategories(fetchedCategories);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching featured categories:", err);
                setError("Failed to load featured categories.");
                setLoading(false);
            }
        };

        fetchFeaturedCategories();
    }, []);

    if (loading) {
        return <p className="text-center py-8">Loading categories...</p>;
    }

    if (error) {
        return <p className="text-center py-8 text-red-500">{error}</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {categories.map((category) => (
                <Link href={`/category/${category.id}`} key={category.id} className="block text-center group">
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <h2 className="text-2xl font-semibold capitalize group-hover:underline">
                            {category.category_name}
                        </h2>
                    </div>
                </Link>
            ))}
        </div>
    );
}
