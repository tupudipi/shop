'use client'
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/firebaseInit";

export default function LowStockAlert() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lowStockProducts, setLowStockProducts] = useState([]);

    useEffect(() => {
        async function fetchLowStockProducts() {
            try {
                const productsRef = collection(db, 'Products');
                const q = query(productsRef, where('stock', '<=', 20));
                const querySnapshot = await getDocs(q);
                
                const products = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setLowStockProducts(products);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching low stock products: ", err);
                setError("Failed to fetch low stock products. Please try again later.");
                setLoading(false);
            }
        }

        fetchLowStockProducts();
    }, []);

    const getStockColor = (stock) => {
        const yellow = { r: 250, g: 204, b: 21 }; // yellow-400
        const orange = { r: 249, g: 115, b: 22 }; // orange-500
        const red = { r: 220, g: 38, b: 38 };    // red-600

        let color;
        if (stock > 10) {
            // Interpolate between yellow and orange
            const t = (20 - stock) / 10;
            color = {
                r: Math.round(yellow.r + t * (orange.r - yellow.r)),
                g: Math.round(yellow.g + t * (orange.g - yellow.g)),
                b: Math.round(yellow.b + t * (orange.b - yellow.b))
            };
        } else {
            // Interpolate between orange and red
            const t = (10 - stock) / 10;
            color = {
                r: Math.round(orange.r + t * (red.r - orange.r)),
                g: Math.round(orange.g + t * (red.g - orange.g)),
                b: Math.round(orange.b + t * (red.b - orange.b))
            };
        }

        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Low Stock Alert</h2>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-red-600 text-center py-4">{error}</div>
            ) : lowStockProducts.length === 0 ? (
                <div className="text-green-600 text-center py-4">All products are well-stocked!</div>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {lowStockProducts.map((product) => (
                        <li key={product.id} className="py-4 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">{product.name}</span>
                            <span 
                                className="text-sm font-semibold"
                                style={{ color: getStockColor(product.stock) }}
                            >
                                {product.stock} left
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}