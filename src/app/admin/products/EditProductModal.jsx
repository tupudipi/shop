'use client'

import { useState, useEffect } from 'react';
import DragAndDropImageUpload from './DragAndDropImageUpload';

const EditProductModal = ({ isOpen, onClose, product, categories, onSave }) => {
    const [formData, setFormData] = useState({ ...product });

    useEffect(() => {
        setFormData({ ...product });
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (newImage) => {
        setFormData((prev) => ({ ...prev, image: newImage }));
    };

    const handleSaveClick = () => {
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Product {formData.name}</h3>
                <div className="mt-2 max-h-96 overflow-y-auto p-2">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <DragAndDropImageUpload image={formData.image} setImage={handleImageChange} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={handleSaveClick} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Save
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;
