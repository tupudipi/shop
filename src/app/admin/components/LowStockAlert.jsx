'use client'

import { useState, useEffect } from 'react';

export default function LowStockAlert() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lowStockProducts, setLowStockProducts] = useState([]);

    useEffect(() => {
        // Fetch low stock products here
        // setLoading(false);
        // setLowStockProducts(fetchedData);
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Low Stock Alert</h2>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-red-600 text-center py-4">{error}</div>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {lowStockProducts.map((product) => (
                        <li key={product.id} className="py-4 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">{product.name}</span>
                            <span className="text-sm text-red-600 font-semibold">{product.stock} left</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}