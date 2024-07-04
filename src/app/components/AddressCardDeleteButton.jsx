'use client'
import { useState, useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, onConfirm }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-6">Are you sure you want to delete this address?</p>
                <div className="flex justify-end space-x-4">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 rounded transition duration-200 ease-in-out hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="px-4 py-2 bg-red-500 text-white rounded transition duration-200 ease-in-out hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddressCardDeleteButton = ({ removeAddress, addressId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleRemove = () => {
        setIsModalOpen(true);
    }

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await removeAddress(addressId);
        } catch (error) {
            console.error("Failed to delete address:", error);
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false);
        }
    }

    return (
        <>
            <button 
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400" 
                onClick={handleRemove}
                disabled={isDeleting}
            >
                {isDeleting ? 'Deleting...' : 'Remove'}
            </button>
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={confirmDelete} 
            />
        </>
    )
}

export default AddressCardDeleteButton;