import Link from "next/link";

const AdressCard = ({ isDelivery, isMain }) => {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-4">
                <h2 className="text-lg">
                    {isDelivery ? "Delivery Details" : "Billing Details"}
                </h2>
            </div>

            <div className="mb-2 font-light">
                <p className="text-sm">
                    Full Name: John Doe
                </p>
                <p className="text-sm">
                    Address: 123 Main St
                </p>
                <p className="text-sm">
                    City: New York
                </p>
                <p className="text-sm">
                    County: Manhattan
                </p>
                <p className="text-sm">
                    Country: United States
                </p>
                <p className="text-sm">
                    Phone Number: 123-456-7890
                </p>
            </div>

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
        </div>
    );
}

export default AdressCard;

