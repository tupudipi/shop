import Link from "next/link";
import AddressCardDeleteButton from "./AddressCardDeleteButton";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseInit";

const fetchAddressesData = async (addressId) => {
  const addressesCollection = collection(db, 'Addresses');
  const q = query(addressesCollection, where('__name__', '==', addressId));
  const querySnapshot = await getDocs(q);
  const address = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return address[0]; 
}

async function AddressCard ({ isMainDelivery, isMainBilling, address, removeAddress, isInfo, addressId }) {
  const title = isMainDelivery ? "Main Delivery Address" :
    isMainBilling ? "Main Billing Address" :
      "";

  let addressDataFromId = null;
  if (addressId) {
    addressDataFromId = await fetchAddressesData(addressId);
  }

  return (
    <>
      {address ? (
        <div className="border p-4 rounded shadow bg-white">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p>Full Name: {address.firstname} {address.surname}</p>
          <p>Address: {address.address}</p>
          <p>City: {address.city}</p>
          <p>County: {address.county}</p>
          <p>Phone Number: {address.phone}</p>

          {!isInfo && (
            <div className="mt-4 space-x-2">
              <Link href={`/account/delivery-billing/edit/${address.id}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Edit
              </Link>
              {!isMainDelivery && !isMainBilling && (
                <AddressCardDeleteButton removeAddress={removeAddress} addressId={address.id} />
              )}
            </div>
          )}
        </div>
      ) : (
        addressDataFromId && (
          <div className="border p-4 rounded shadow bg-white">
            <p>Full Name: {addressDataFromId.firstname} {addressDataFromId.surname}</p>
            <p>Address: {addressDataFromId.address}</p>
            <p>City: {addressDataFromId.city}</p>
            <p>County: {addressDataFromId.county}</p>
            <p>Phone Number: {addressDataFromId.phone}</p>
          </div>
        )
      )}
    </>
  );
}

export default AddressCard;