'use client'
import { useState, useEffect } from 'react';

export default function Modal({ isOpen, onClose, address, onSave }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (address) {
            const { id, ...addressWithoutId } = address;
            setFormData(addressWithoutId);
        }
    }, [address]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        onSave({ ...formData, id: address.id });
        onClose();
    };

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={handleBackgroundClick}>
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold mb-4">Edit Address</h2>
                {address && (
                    <form className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                            <input
                                type="text"
                                name="county"
                                value={formData.county || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="col-span-2 flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isMainDelivery"
                                    checked={formData.isMainDelivery || false}
                                    onChange={handleChange}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">Main Delivery Address</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isMainBilling"
                                    checked={formData.isMainBilling || false}
                                    onChange={handleChange}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">Main Billing Address</span>
                            </label>
                        </div>
                    </form>
                )}
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
}