import Link from "next/link";
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from 'next/navigation';
import AddressForm from './AddressForm';
import { revalidatePath } from "next/cache";

async function updateMainAddressStatus(userEmail, isDelivery, newMainAddressId) {
    const addressesCollection = collection(db, 'Addresses');
    const fieldToUpdate = isDelivery ? 'isMainDelivery' : 'isMainBilling';

    // Query for the current main address
    const q = query(addressesCollection,
        where('user_email', '==', userEmail),
        where(fieldToUpdate, '==', true)
    );

    const querySnapshot = await getDocs(q);

    // Update the old main address
    querySnapshot.forEach(async (document) => {
        if (document.id !== newMainAddressId) {
            await updateDoc(doc(db, 'Addresses', document.id), {
                [fieldToUpdate]: false
            });
        }
    });
}

const addAddress = async (newData, userEmail) => {
    const addressesCollection = collection(db, 'Addresses');

    // Add the new address
    const docRef = await addDoc(addressesCollection, {
        ...newData,
        user_email: userEmail
    });

    // Update main address status if necessary
    if (newData.isMainDelivery) {
        await updateMainAddressStatus(userEmail, true, docRef.id);
    }
    if (newData.isMainBilling) {
        await updateMainAddressStatus(userEmail, false, docRef.id);
    }
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
