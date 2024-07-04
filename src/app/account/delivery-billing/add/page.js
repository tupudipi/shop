import Link from "next/link";
import { collection, addDoc } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from 'next/navigation';
import AddressForm from './AddressForm';
import { revalidatePath } from "next/cache";

const addAddress = async (newData, userEmail) => {
    const addressesCollection = collection(db, 'Addresses');
    await addDoc(addressesCollection, {
        ...newData,
        user_email: userEmail
    });
}

export default async function AddAddressPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login');
    }

    async function handleSubmit(formData) {
        'use server'
        const newAddress = {
            firstname: formData.get('firstName'),
            surname: formData.get('lastName'),
            phone: formData.get('phoneNumber'),
            address: formData.get('address'),
            city: formData.get('city'),
            county: formData.get('county'),
            isMainDelivery: formData.get('useAsDeliveryAddress') === 'on',
            isMainBilling: formData.get('useAsBillingAddress') === 'on',
        };

        try {
            revalidatePath('/account/delivery-billing');
            await addAddress(newAddress, session.user.email);
            return { success: true };
        } catch (error) {
            console.error('Error adding address:', error);
            return { success: false, error: error.message };
        }
    }

    return (
        <div>
            <Link href="/account/delivery-billing">
                <p className="text-blue-500 hover:underline hover:text-blue-700 my-1">{"<"} Back to Delivery and Billing</p>
            </Link>
            <h1 className="text-4xl font-medium">Add Address</h1>
            <AddressForm handleSubmit={handleSubmit} />
        </div>
    );
}
