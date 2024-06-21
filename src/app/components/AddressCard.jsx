import Link from "next/link";

const AddressCard = ({ isDelivery, isMain, isInfo, address }) => {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-4">
                <h2 className="text-lg">
                    {isDelivery ? "Delivery Details" : "Billing Details"}
                </h2>
            </div>

            <div className="mb-2 font-light">
                <p className="text-sm">
                    Full Name: {address.firstname} {address.surname}
                </p>
                <p className="text-sm">
                    Address: {address.address}
                </p>
                <p className="text-sm">
                    City: {address.city}
                </p>
                <p className="text-sm">
                    County: {address.county}
                </p>
                <p className="text-sm">
                    Phone Number: {address.phone}
                </p>
            </div>

            {!isInfo && (
                <div className="flex gap-3">
                    <Link href="/account/delivery-billing/edit/1" className="text-blue-500 underline">
                        Edit
                    </Link>
                    {!isMain && (
                        <button className="text-red-500 underline">
                            Remove
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default AddressCard;

