import Link from "next/link";
import AddressCardDeleteButton from "./AddressCardDeleteButton";

const AddressCard = ({ isMainDelivery, isMainBilling,  address, removeAddress }) => {
  const title = isMainDelivery ? "Main Delivery Address" : 
                isMainBilling ? "Main Billing Address" : 
                "";

  return (
    <div className="border p-4 rounded shadow bg-white">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p>Full Name: {address.firstname} {address.surname}</p>
      <p>Address: {address.address}</p>
      <p>City: {address.city}</p>
      <p>County: {address.county}</p>
      <p>Phone Number: {address.phone}</p>
      
      <div className="mt-4 space-x-2">
        <Link href={`/account/delivery-billing/edit/${address.id}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          Edit
        </Link>
        {!isMainDelivery && !isMainBilling && (
          <AddressCardDeleteButton removeAddress={removeAddress} addressId={address.id} />
        )}
      </div>
    </div>
  );
}

export default AddressCard;