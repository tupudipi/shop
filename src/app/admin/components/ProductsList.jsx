'use client';

import { useState, useEffect } from 'react';
import { db } from "@/firebaseInit";
import { collection, query, getDocs } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = () => {
        let startPage = Math.max(2, currentPage - 2);
        let endPage = Math.min(totalPages - 1, currentPage + 2);

        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages - 1);
        }

        if (currentPage >= totalPages - 2) {
            startPage = Math.max(totalPages - 4, 2);
        }

        return pageNumbers.slice(startPage - 1, endPage).map(number => (
            <button
                key={number}
                onClick={() => onPageChange(number)}
                className={`px-3 py-1 mx-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
            >
                {number}
            </button>
        ));
    };

    return (
        <div className="flex items-center justify-center mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
            >
                <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button
                onClick={() => onPageChange(1)}
                className={`px-3 py-1 mx-1 rounded ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
            >
                1
            </button>
            {currentPage > 3 && <span className="mx-1">...</span>}
            {renderPageNumbers()}
            {currentPage < totalPages - 2 && <span className="mx-1">...</span>}
            {totalPages > 1 && (
                <button
                    onClick={() => onPageChange(totalPages)}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                >
                    {totalPages}
                </button>
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
            >
                <FontAwesomeIcon icon={faAngleRight} />
            </button>
        </div>
    );
};

export default function ProductsList() {
    const [activeTab, setActiveTab] = useState('mostSold');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [totalProducts, setTotalProducts] = useState(0); // Track total products for pagination

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const categoriesRef = collection(db, 'Categories');
                const categorySnapshot = await getDocs(categoriesRef);
                const categoryData = categorySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCategories(categoryData);

                const productsRef = collection(db, 'Products');
                let productQuery = query(productsRef);

                const ordersRef = collection(db, 'Orders');
                const ordersSnapshot = await getDocs(ordersRef);

                const wishlistsRef = collection(db, 'Wishlists');
                const wishlistsSnapshot = await getDocs(wishlistsRef);

                let fetchedProducts = [];
                const querySnapshot = await getDocs(productQuery);
                querySnapshot.forEach(doc => {
                    fetchedProducts.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                fetchedProducts = fetchedProducts.map(product => {
                    const sales = ordersSnapshot.docs.reduce((acc, order) => {
                        const orderData = order.data();
                        const orderItems = orderData.products || [];
                        const productOrder = orderItems.find(item => item.slug === product.id);
                        return acc + (productOrder ? productOrder.quantity : 0);
                    }, 0);

                    const wishlists = wishlistsSnapshot.docs.reduce((acc, wishlist) => {
                        const wishlistData = wishlist.data();
                        return acc + (wishlistData.slug === product.id ? 1 : 0);
                    }, 0);

                    return {
                        ...product,
                        sales,
                        wishlists,
                    };
                });

                fetchedProducts.sort((a, b) => {
                    if (activeTab === 'mostSold') {
                        return b.sales - a.sales;
                    } else if (activeTab === 'mostWishlisted') {
                        return b.wishlists - a.wishlists;
                    } else {
                        return b.reviewCount - a.reviewCount;
                    }
                });

                if (selectedCategory !== 'All') {
                    fetchedProducts = fetchedProducts.filter(product => String(product.category_id) === String(selectedCategory));
                }

                // Set total products for pagination and slice the products for the current page
                setTotalProducts(fetchedProducts.length);
                const startIndex = (currentPage - 1) * productsPerPage;
                const paginatedProducts = fetchedProducts.slice(startIndex, startIndex + productsPerPage);
                setProducts(paginatedProducts);
            } catch (err) {
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeTab, currentPage, selectedCategory, productsPerPage]);

    // Reset currentPage when changing the tab or category
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, selectedCategory]);

    const totalPages = Math.ceil(totalProducts / productsPerPage);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Product Summary</h2>

            {/* Sorting Tabs */}
            <div className="flex space-x-4 mb-4">
                {['mostSold', 'mostWishlisted', 'mostReviewed'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
                    </button>
                ))}
            </div>

            {/* Category Filter */}
            <div className="flex justify-between items-center mb-4">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border rounded-md"
                >
                    <option value="All">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
            </div>
            {/* Render Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
            />

            {/* Loading/Error States */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-red-600 text-center py-4">{error}</div>
            ) : (
                <>
                    {/* Product Table */}
                    <table className="w-full mt-4">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">Product Name</th>
                                <th className="px-4 py-2 text-left">Category</th>
                                <th className="px-4 py-2 text-left">
                                    {activeTab === 'mostSold'
                                        ? 'Units Sold'
                                        : activeTab === 'mostWishlisted'
                                            ? 'Times Wishlisted'
                                            : 'Number of Reviews'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td className="px-4 py-2">{product.name}</td>
                                    <td className="px-4 py-2">{categories.find(c => c.id == product.category_id)?.category_name}</td>
                                    <td className="px-4 py-2">
                                        {activeTab === 'mostSold' ? product.sales
                                            : activeTab === 'mostWishlisted' ? product.wishlists
                                                : product.reviewCount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}
