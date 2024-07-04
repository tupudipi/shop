import AddressCard from "@/app/components/AddressCard";
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Link from 'next/link';
import { revalidatePath } from "next/cache";

const fetchAddressesData = async (user_email) => {
  const addressesCollection = collection(db, 'Addresses');
  const q = query(addressesCollection, where('user_email', '==', user_email));
  const querySnapshot = await getDocs(q);
  const addresses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Sort addresses: main delivery and billing first, then others
  return addresses.sort((a, b) => {
    if (a.isMainDelivery || a.isMainBilling) return -1;
    if (b.isMainDelivery || b.isMainBilling) return 1;
    return 0;
  });
}

const removeAddress = async (addressId) => {
  'use server'
  await deleteDoc(doc(db, 'Addresses', addressId));
  revalidatePath('/account/delivery-billing');
}


async function DeliveryBillingPage() {
  const session = await getServerSession(authOptions);
  const addresses = await fetchAddressesData(session.user.email);

  const mainDeliveryAddress = addresses.find(a => a.isMainDelivery);
  const mainBillingAddress = addresses.find(a => a.isMainBilling);
  const additionalAddresses = addresses.filter(a => !a.isMainDelivery && !a.isMainBilling);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Delivery and Billing Details</h1>

      {addresses.length === 0 ? (
        <p className="mb-4">You have no saved addresses. Please add an address.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {mainDeliveryAddress ? (
              <AddressCard
                isMainDelivery={true}
                isInfo={false}
                address={mainDeliveryAddress}
                removeAddress={removeAddress}
              />
            ) : (
              <div className="border p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">No Main Delivery Address</h3>
                <p>Please select a main delivery address from your saved addresses.</p>
              </div>
            )}

            {mainBillingAddress ? (
              <AddressCard
                isMainBilling={true}
                isInfo={false}
                address={mainBillingAddress}
                removeAddress={removeAddress}
              />
            ) : (
              <div className="border p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">No Main Billing Address</h3>
                <p>Please select a main billing address from your saved addresses.</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Additional Addresses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalAddresses.map((address) => (
                <AddressCard
                  key={address.id}
                  isMainDelivery={address.isMainDelivery}
                  isMainBilling={address.isMainBilling}
                  isInfo={false}
                  address={address}
                  removeAddress={removeAddress}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <Link href="/account/delivery-billing/add" className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Add an additional address
      </Link>
    </div>
  )
}

export default DeliveryBillingPage;
