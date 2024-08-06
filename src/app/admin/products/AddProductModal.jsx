import { useState, useRef } from 'react';
import { storage } from "@/firebaseInit";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from 'next/image';

const AddProductModal = ({ isOpen, onClose, onAddProduct, categories }) => {
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        image: '',
        category_id: '',
        price: 0,
        stock: 0,
    });
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFiles = async (files) => {
        if (files.length > 0) {
            const file = files[0];
            const storageRef = ref(storage, `${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setNewProduct({ ...newProduct, image: downloadURL });
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddProduct(newProduct);
        setNewProduct({
            name: '',
            description: '',
            image: '',
            category_id: '',
            price: 0,
            stock: 0,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Product</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={newProduct.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        className="w-full p-2 mb-2 border rounded"
                        required
                    />
                    <textarea
                        name="description"
                        value={newProduct.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full p-2 mb-2 border rounded"
                        required
                    />
                    <select
                        name="category_id"
                        value={newProduct.category_id}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 border rounded"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                    <div className="w-full rounded flex gap-2 items-baseline">
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={newProduct.price}
                            onChange={handleChange}
                            placeholder="Price"
                            className="flex-grow p-2 mb-2 border rounded"
                            required
                        />
                    </div>

                    <div className="w-full rounded flex gap-2 items-baseline">
                        <label>Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={newProduct.stock}
                            onChange={handleChange}
                            placeholder="Stock"
                            className="flex-grow p-2 mb-2 border rounded"
                            required
                        />
                    </div>
                    <div
                        className={`p-4 mb-2 border-2 border-dashed rounded text-center ${dragActive ? "border-blue-500" : "border-gray-300"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFiles(e.target.files)}
                            className="hidden"
                        />
                        <p>Drag and drop an image here, or click to select</p>
                        <button type="button" onClick={onButtonClick} className="mt-2 text-blue-500">
                            Select Image
                        </button>
                    </div>
                    {newProduct.image && (
                        <Image src={newProduct.image} width={128} height={128} alt="Preview" className="w-full object-cover mb-2" />
                    )}
                    <div className="flex justify-end">
                        <button type="button" onClick={() => {
                            onClose(); setNewProduct({
                                name: '',
                                description: '',
                                image: '',
                                category_id: '',
                                price: 0,
                                stock: 0,
                            })
                        }} className="mr-2 px-4 py-2 bg-gray-200 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;