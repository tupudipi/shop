import AddressCard from "@/app/components/AddressCard";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Link from 'next/link';

const fetchAddressesData = async (user_email) => {
  const addressesCollection = collection(db, 'Addresses');
  const q = query(addressesCollection, where('user_email', '==', user_email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function deliveryBillingPage() {
  const session = await getServerSession(authOptions);
  const addresses = await fetchAddressesData(session.user.email);

  return (
    <div>
      <h1 className="text-4xl font-medium">Delivery and Billing Details</h1>

      {addresses.length === 0 ? (
        <div className="mt-6">
          <p>You have no saved addresses. Please <Link href="/account/delivery-billing/add/" className="text-blue-500 hover:text-blue-700 hover:underline">add an address</Link>.</p>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <h2 className="text-2xl font-medium mb-4">Delivery Addresses</h2>
            <div className="flex flex-col md:flex-row gap-4 flex-wrap">
              {addresses.map((address) => (
                <AddressCard key={address.id} address={address} isDelivery={address.delivery} isMain={address.main} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-medium mb-4">Billing Addresses</h2>
            <div className="flex flex-col md:flex-row gap-4 flex-wrap">
              {addresses.map((address) => (
                <AddressCard key={address.id} address={address} isBilling={address.billing} isMain={address.main} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default deliveryBillingPage;
