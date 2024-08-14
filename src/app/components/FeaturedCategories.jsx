'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import Image from 'next/image';

export default function FeaturedCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedCategories = async () => {
            try {
                let ordersQuery;
                let ordersSnapshot;
                let categorySales = {};
                let productSales = {};
                const categoryNameToIdMap = {};

                const categoriesSnapshot = await getDocs(collection(db, 'Categories'));
                categoriesSnapshot.forEach(categoryDoc => {
                    const categoryData = categoryDoc.data();
                    categoryNameToIdMap[categoryData.category_name] = categoryDoc.id;
                });


                const currentDate = new Date();
                const lastMonth = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1,
                    currentDate.getDate(),
                    currentDate.getHours(),
                    currentDate.getMinutes(),
                    currentDate.getSeconds()
                );
                
                const lastMonthTimestamp = Timestamp.fromDate(lastMonth);
                
                ordersQuery = query(
                    collection(db, 'Orders'),
                    where('createdAt', '>=', lastMonthTimestamp)
                );
                ordersSnapshot = await getDocs(ordersQuery);  
    
                if (ordersSnapshot.empty) {
                    ordersQuery = query(collection(db, 'Orders'));
                    ordersSnapshot = await getDocs(ordersQuery);
                }


                ordersSnapshot.forEach(orderDoc => {
                    const orderData = orderDoc.data();
                    orderData.products.forEach(product => {
                        const categoryName = product.category;
                        const productSlug = product.slug;
                        categorySales[categoryName] = (categorySales[categoryName] || 0) + 1;
                        productSales[productSlug] = (productSales[productSlug] || 0) + 1;
                    });
                });

                const sortedCategories = Object.entries(categorySales)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 4)
                    .map(([category_name]) => category_name);

                if (sortedCategories.length === 0) {
                    throw new Error("No categories found with sales.");
                }

                const fetchedCategories = [];
                for (let categoryName of sortedCategories) {
                    const categoryId = categoryNameToIdMap[categoryName];
                    if (!categoryId) {
                        console.log(`No ID found for category "${categoryName}"`);
                        continue;
                    }

                    const productsQuery = query(
                        collection(db, 'Products'),
                        where('category_id', '==', Number(categoryId))
                    );
                    const productsSnapshot = await getDocs(productsQuery);

                    let bestSellingProduct = null;
                    let maxSales = 0;

                    productsSnapshot.forEach(productDoc => {
                        const productData = productDoc.data();
                        const sales = productSales[productData.slug] || 0;
                        if (sales > maxSales) {
                            maxSales = sales;
                            bestSellingProduct = productData;
                        }
                    });

                    if (bestSellingProduct) {
                        fetchedCategories.push({
                            id: categoryId,
                            category_name: categoryName,
                            bestSellingProductImage: bestSellingProduct.image,
                        });
                    } else {
                        fetchedCategories.push({
                            id: categoryId,
                            category_name: categoryName,
                            bestSellingProductImage: null,
                        });
                    }
                }

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
                <Link href={`/search/${category.category_name}`} key={category.category_name} className="block text-center group hover:shadow-lg transition-all rounded-lg">
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center relative rounded-lg">
                        {category.bestSellingProductImage ? (
                            <Image
                                src={category.bestSellingProductImage}
                                alt={category.category_name}
                                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                width={400}
                                height={400}
                            />
                        ) : (
                            <p>No image available</p>
                        )}
                        <h2 className="text-2xl font-semibold capitalize group-hover:underline relative z-10 bg-black bg-opacity-50 text-white p-2 rounded">
                            {category.category_name}
                        </h2>
                    </div>
                </Link>
            ))}
        </div>
    );
}
