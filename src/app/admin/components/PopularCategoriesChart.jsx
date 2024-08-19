'use client';
import { useState, useEffect, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseInit';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PopularCategoriesChart() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [soldData, setSoldData] = useState(null);
    const [wishlistedData, setWishlistedData] = useState(null);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());
    const [categories, setCategories] = useState([]);

    const generateColors = (count) => {
        const hueStep = 360 / count;
        return Array.from({ length: count }, (_, i) => `hsla(${i * hueStep}, 70%, 60%, 0.6)`);
    };

    const colors = useMemo(() => {
        return generateColors(categories.length);
    }, [categories]);

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const fetchedCategories = await fetchCategories();
            setCategories(fetchedCategories);
            const soldData = await fetchSoldData(fetchedCategories);
            const wishlistedData = await fetchWishlistedData(fetchedCategories);

            const updatedColors = generateColors(fetchedCategories.length);
            setSoldData(prepareChartData(soldData, 'Products Sold', fetchedCategories, updatedColors));
            setWishlistedData(prepareChartData(wishlistedData, 'Products Wishlisted', fetchedCategories, updatedColors));
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again later.');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        const categoriesSnapshot = await getDocs(collection(db, 'Categories'));
        return categoriesSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().category_name
        }));
    };

    const fetchSoldData = async (categories) => {
        const ordersSnapshot = await getDocs(query(
            collection(db, 'Orders'),
            where('createdAt', '>=', Timestamp.fromDate(startDate)),
            where('createdAt', '<=', Timestamp.fromDate(endDate))
        ));

        const categoryCount = {};

        ordersSnapshot.forEach(doc => {
            const orderData = doc.data();
            if (orderData.status !== 'canceled') {
                orderData.products.forEach(product => {
                    if (product.category in categoryCount) {
                        categoryCount[product.category]++;
                    } else {
                        categoryCount[product.category] = 1;
                    }
                });
            }
        });

        return categoryCount;
    };

    const fetchWishlistedData = async (categories) => {
        const wishlistsSnapshot = await getDocs(collection(db, 'Wishlists'));
        const categoryCount = {};

        wishlistsSnapshot.forEach(doc => {
            const wishlistData = doc.data();
            const category = categories.find(c => Number(c.id) === Number(wishlistData.category_id))?.name;
            if (category) {
                if (category in categoryCount) {
                    categoryCount[category]++;
                } else {
                    categoryCount[category] = 1;
                }
            }
        });

        return categoryCount;
    };

    const prepareChartData = (data, label, categories, colors) => {
        const labels = categories.map(c => c.name);
        const values = labels.map(label => data[label] || 0);

        return {
            labels,
            datasets: [
                {
                    label,
                    data: values,
                    backgroundColor: colors,
                    borderColor: colors.map(color => color.replace('0.6', '1')),
                    borderWidth: 1,
                },
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Popular Categories</h2>
            <div className="flex flex-col items-center gap-2">
                <div className='flex justify-between items-baseline w-full'>
                    <p className="text-lg font-semibold text-gray-800">Filter Sales Data By Date</p>
                </div>
                <div className='flex justify-between items-baseline w-full'>
                    <p>From</p>
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="p-2 border rounded"
                        dateFormat={"dd/MM/yyyy"}
                    />
                </div>

                <div className='flex justify-between items-baseline w-full'>
                    <p>To</p>
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="p-2 border rounded"
                        dateFormat={"dd/MM/yyyy"}
                    />
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-red-600 text-center py-4">
                    {error}
                    <button onClick={fetchData} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    <div className="max-h-72 pb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">By Products Sold</h3>
                        <Pie data={soldData} options={chartOptions} />
                    </div>
                    <div className="max-h-72 mt-8 pb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">By Products Wishlisted (All Time)</h3>
                        <Pie data={wishlistedData} options={chartOptions} />
                    </div>
                </>
            )}
        </div>
    );
}
