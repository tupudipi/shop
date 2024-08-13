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

                console.log("Step 1: Fetching all categories for name-to-ID mapping...");
                const categoriesSnapshot = await getDocs(collection(db, 'Categories'));
                categoriesSnapshot.forEach(categoryDoc => {
                    const categoryData = categoryDoc.data();
                    categoryNameToIdMap[categoryData.category_name] = categoryDoc.id;
                    console.log(`Mapped category name "${categoryData.category_name}" to ID "${categoryDoc.id}"`);
                });

                console.log("Step 2: Fetching orders from the last month...");
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                ordersQuery = query(
                    collection(db, 'Orders'),
                    where('created_at', '>=', Timestamp.fromDate(lastMonth))
                );
                ordersSnapshot = await getDocs(ordersQuery);

                if (ordersSnapshot.empty) {
                    console.log("No orders in the last month, fetching all-time data");
                    ordersQuery = query(collection(db, 'Orders'));
                    ordersSnapshot = await getDocs(ordersQuery);
                }

                console.log(`Number of orders: ${ordersSnapshot.size}`);

                ordersSnapshot.forEach(orderDoc => {
                    const orderData = orderDoc.data();
                    orderData.products.forEach(product => {
                        const categoryName = product.category;
                        const productSlug = product.slug;
                        categorySales[categoryName] = (categorySales[categoryName] || 0) + 1;
                        productSales[productSlug] = (productSales[productSlug] || 0) + 1;
                    });
                });

                console.log("Category sales:", categorySales);
                console.log("Product sales:", productSales);

                const sortedCategories = Object.entries(categorySales)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 4)
                    .map(([category_name]) => category_name);

                console.log("Sorted categories:", sortedCategories);

                if (sortedCategories.length === 0) {
                    throw new Error("No categories found with sales.");
                }

                console.log("Step 3: Fetching products for each category...");
                const fetchedCategories = [];
                for (let categoryName of sortedCategories) {
                    const categoryId = categoryNameToIdMap[categoryName];
                    if (!categoryId) {
                        console.log(`No ID found for category "${categoryName}"`);
                        continue;
                    }

                    console.log(`Fetching products for category "${categoryName}" with ID "${categoryId}"`);
                    const productsQuery = query(
                        collection(db, 'Products'),
                        where('category_id', '==', Number(categoryId))
                    );
                    const productsSnapshot = await getDocs(productsQuery);

                    console.log(`Number of products found for category "${categoryName}": ${productsSnapshot.size}`);

                    let bestSellingProduct = null;
                    let maxSales = 0;

                    productsSnapshot.forEach(productDoc => {
                        const productData = productDoc.data();
                        const sales = productSales[productData.slug] || 0;
                        console.log(`Product: ${productData.slug}, Sales: ${sales}`);
                        if (sales > maxSales) {
                            maxSales = sales;
                            bestSellingProduct = productData;
                        }
                    });

                    if (bestSellingProduct) {
                        console.log(`Best selling product for category "${categoryName}": ${bestSellingProduct.slug}`);
                        fetchedCategories.push({
                            id: categoryId,
                            category_name: categoryName,
                            bestSellingProductImage: bestSellingProduct.image,
                        });
                    } else {
                        console.log(`No best selling product found for category "${categoryName}"`);
                        fetchedCategories.push({
                            id: categoryId,
                            category_name: categoryName,
                            bestSellingProductImage: null,
                        });
                    }
                }

                console.log("Fetched categories:", fetchedCategories);

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
                <Link href={`/category/${category.id}`} key={category.id} className="block text-center group hover:shadow-md transition-all">
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
