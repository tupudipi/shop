import Link from "next/link"
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from 'next/navigation';
import AddressForm from './AddressForm';

const fetchAddressData = async (addressId, userEmail) => {
    const addressCollection = collection(db, 'Addresses');
    const q = query(addressCollection, where('__name__', '==', addressId), where('user_email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }
    return null;
}

const updateAddress = async (addressId, updatedData, userEmail) => {
    const addressRef = doc(db, 'Addresses', addressId);
    const addressDoc = await getDocs(query(collection(db, 'Addresses'), where('__name__', '==', addressId), where('user_email', '==', userEmail)));

    if (addressDoc.empty) {
        throw new Error('Address not found or user not authorized');
    }

    await updateDoc(addressRef, updatedData);
}

export default async function EditAddressPage({ params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login');
    }

    const addressId = params.addressId;
    const address = await fetchAddressData(addressId, session.user.email);

    if (!address) {
        return <div>Address not found or you&apos;re not authorized to edit this address</div>;
    }

    async function handleSubmit(formData) {
        'use server'
        const updatedAddress = {
            firstname: formData.get('firstName'),
            surname: formData.get('lastName'),
            phone: formData.get('phoneNumber'),
            address: formData.get('address'),
            city: formData.get('city'),
            county: formData.get('county'),
            delivery: formData.get('useAsDeliveryAddress') === 'on',
            billing: formData.get('useAsBillingAddress') === 'on',
        };

        try {
            await updateAddress(addressId, updatedAddress, session.user.email);
            return { success: true };
        } catch (error) {
            console.error('Error updating address:', error);
            return { success: false, error: error.message };
        }
    }

    return (
        <div>
            <Link href="/account/delivery-billing">
                <p className="text-blue-500 hover:underline hover:text-blue-700 my-1">{"<"} Back to Delivery and Billing</p>
            </Link>
            <h1 className="text-4xl font-medium">Edit Address</h1>
            <AddressForm address={address} handleSubmit={handleSubmit} />
        </div>
    )
}