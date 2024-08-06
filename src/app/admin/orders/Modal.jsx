'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Modal({ isOpen, onClose, order, onSave }) {
    const [formData, setFormData] = useState({});
    const [statusNote, setStatusNote] = useState('');

    useEffect(() => {
        if (order) {
            const { id, ...orderWithoutId } = order;
            setFormData(orderWithoutId);
        }
    }, [order]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        const newStatusHistory = {
            status: formData.status,
            note: statusNote,
            timestamp: new Date().toISOString(),
        };
        const updatedOrder = {
            ...formData,
            id: order.id,
            statusHistory: [...(order.statusHistory || []), newStatusHistory]
        };
        onSave(updatedOrder);
        onClose();
    };

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const statusOptions = [
        { value: 'Pending', color: 'yellow' },
        { value: 'Canceled', color: 'red' },
        { value: 'Delivered', color: 'green' },
        { value: 'Processing', color: 'blue' },
        { value: 'Returned', color: 'purple' }  // Added 'Returned' as the missing status
    ];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center" onClick={handleBackgroundClick}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
                {order && (
                    <div className="mt-2 max-h-96 overflow-y-auto">
                        <div className="mb-4">
                            <ul className="space-y-2">
                                {order.products.map((product, index) => (
                                    <li key={index} className="border-b pb-2">
                                        <div className="flex items-center space-x-4">
                                            <Image src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" width={64} height={64}/>
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-gray-600">Quantity: {product.quantity}</p>
                                                <p className="text-gray-600">Price: ${product.pricePerPiece.toFixed(2)}</p>
                                                <p className="text-gray-600">Total: ${product.totalPerProduct.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Edit Order Status Section */}
                        <h3 className="text-xl font-semibold mb-2">Edit Order Status</h3>
                        <form className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                                <select
                                    name="status"
                                    value={formData.status || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status Note</label>
                                <textarea
                                    name="statusNote"
                                    value={statusNote}
                                    onChange={(e) => setStatusNote(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                />
                            </div>
                        </form>
                    </div>
                )}
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
}
