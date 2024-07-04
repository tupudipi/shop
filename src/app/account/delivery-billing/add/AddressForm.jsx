'use client';
import { useState, useEffect } from 'react';
import Toast from '@/app/components/Toast';
import { useRouter } from 'next/navigation';

export default function AddressForm({ address = {}, handleSubmit }) {
    const [toastState, setToastState] = useState({ show: false, loading: false });
    const router = useRouter();

    useEffect(() => {
        if (toastState.show && !toastState.loading) {
            const timer = setTimeout(() => {
                setToastState({ show: false, loading: false });
                router.push('/account/delivery-billing');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [toastState]);

    const onSubmit = async (event) => {
        event.preventDefault();
        setToastState({ show: true, loading: true });
        const formData = new FormData(event.target);
        const result = await handleSubmit(formData);
        if (result.success) {
            setToastState({ show: true, loading: false });
        } else {
            setToastState({ show: false, loading: false });
            console.error(result.error);
        }
    };

    return (
        <>
            <form onSubmit={onSubmit} className="lg:grid lg:grid-cols-2">
                <div className="mt-6 flex flex-col gap-2 lg:mr-32">
                    <h2 className="text-2xl font-medium mb-2">Contact Details</h2>
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" name="firstName" id="firstName" defaultValue={address.firstname} className="mt-1 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-40 mb-2 transition-all w-full rounded-md shadow h-7 p-4" />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" name="lastName" id="lastName" defaultValue={address.surname} className="mt-1 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-40 mb-2 transition-all w-full rounded-md shadow h-7 p-4" />
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" name="phoneNumber" id="phoneNumber" defaultValue={address.phone} autoComplete="tel" className="mt-1 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-40 mb-2 transition-all w-full rounded-md shadow h-7 p-4" />
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                    <h2 className="text-2xl font-medium mb-2">Address Details</h2>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea name="address" id="address" defaultValue={address.address} className="mt-1 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-40 mb-2 transition-all w-full rounded-md shadow h-20 p-4" />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                        <input type="text" name="city" id="city" defaultValue={address.city} className="mt-1 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-40 mb-2 transition-all w-full rounded-md shadow h-7 p-4" />
                    </div>
                    <div>
                        <label htmlFor="county" className="block text-sm font-medium text-gray-700">County</label>
                        <input type="text" name="county" id="county" defaultValue={address.county} className="mt-1 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-40 mb-2 transition-all w-full rounded-md shadow h-7 p-4" />
                    </div>
                </div>
                <div className="mt-6 w-full lg:w-auto text-center lg:text-left">
                    <div>
                        <div>
                            <input type="checkbox" id="useAsDeliveryAddress" name="useAsDeliveryAddress" defaultChecked={address.isMainDelivery} className="mr-2" />
                            <label htmlFor="useAsDeliveryAddress" className="text-sm font-medium text-gray-700">Use this as main delivery address</label>
                        </div>
                        <div>
                            <input type="checkbox" id="useAsBillingAddress" name="useAsBillingAddress" defaultChecked={address.isMainBilling} className="mr-2" />
                            <label htmlFor="useAsBillingAddress" className="text-sm font-medium text-gray-700">Use this as main billing address</label>
                        </div>
                    </div>
                    <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow hover:shadow-md font-semibold text-white bg-indigo-500 hover:bg-indigo-700 w-2/3 text-center mt-2">
                        Submit
                    </button>
                </div>
            </form>
            {toastState.show && (
                <Toast
                    message="Address saved successfully!"
                    isLoading={toastState.loading}
                    duration={3000}
                />
            )}
        </>
    );
}
