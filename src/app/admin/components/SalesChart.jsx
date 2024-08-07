'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = () => {
    const [timeFrame, setTimeFrame] = useState('month');
    const [orderData, setOrderData] = useState({ labels: [], orderCounts: [], averageValues: [], totalValues: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderData();
    }, [timeFrame]);

    const fetchOrderData = async () => {
        setLoading(true);
        setError(null);
        try {
            const ordersRef = collection(db, 'Orders');
            let startDate, endDate, interval;

            switch (timeFrame) {
                case 'this week':
                    startDate = startOfWeek(new Date());
                    endDate = endOfWeek(new Date());
                    interval = 'day';
                    break;
                case 'this month':
                    startDate = startOfMonth(new Date());
                    endDate = endOfMonth(new Date());
                    interval = 'day';
                    break;
                case 'this year':
                    startDate = startOfYear(new Date());
                    endDate = endOfYear(new Date());
                    interval = 'month';
                    break;
                default:
                    startDate = startOfMonth(new Date());
                    endDate = endOfMonth(new Date());
                    interval = 'day';
            }

            const q = query(ordersRef, where('createdAt', '>=', startDate), where('createdAt', '<=', endDate));
            const querySnapshot = await getDocs(q);

            const ordersByDate = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const date = format(data.createdAt.toDate(), interval === 'day' ? 'yyyy-MM-dd' : 'yyyy-MM');

                if (!ordersByDate[date]) {
                    ordersByDate[date] = { count: 0, total: 0 };
                }
                ordersByDate[date].count += 1;
                ordersByDate[date].total += data.total;
            });

            const labels = Object.keys(ordersByDate).sort();
            const orderCounts = labels.map(date => ordersByDate[date].count);
            const totalValues = labels.map(date => ordersByDate[date].total);
            const averageValues = labels.map(date => ordersByDate[date].total / ordersByDate[date].count || 0);

            setOrderData({ labels, orderCounts, averageValues, totalValues });
        } catch (error) {
            setError('Failed to fetch order data');
            console.error('Error fetching order data:', error);
        } finally {
            setLoading(false);
        }
    };

    const createChartOptions = (title) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: title, font: { size: 16 } },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value, index, values) {
                        if (value >= 1000000) {
                            return (value / 1000000).toFixed(1) + 'M';
                        } else if (value >= 1000) {
                            return (value / 1000).toFixed(1) + 'K';
                        } else {
                            return value;
                        }
                    }
                }
            },
        },
});

    const orderCountData = {
        labels: orderData.labels,
        datasets: [
            {
                label: 'Number of Orders',
                data: orderData.orderCounts,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const averageValueData = {
        labels: orderData.labels,
        datasets: [
            {
                label: 'Average Order Value',
                data: orderData.averageValues,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    const totalValueData = {
        labels: orderData.labels,
        datasets: [
            {
                label: 'Total Order Value',
                data: orderData.totalValues,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Sales Overview</h2>
                <div className="flex space-x-2">
                    {['this week', 'this month', 'this year'].map((period) => (
                        <button
                            key={period}
                            onClick={() => setTimeFrame(period)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeFrame === period
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-red-600 text-center py-4">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="h-64">
                        <Bar options={createChartOptions('Number of Orders')} data={orderCountData} />
                    </div>
                    <div className="h-64">
                        <Bar options={createChartOptions('Average Order Value')} data={averageValueData} />
                    </div>
                    <div className="h-64">
                        <Bar options={createChartOptions('Total Sales')} data={totalValueData} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesChart;