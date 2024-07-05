import Link from "next/link"
import AddressCard from "@/app/components/AddressCard";
import { db } from "@/firebaseInit";
import { doc, getDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const fetchOrderData = async (orderId, userEmail) => {
    const orderDocRef = doc(db, 'Orders', orderId);
    const orderDoc = await getDoc(orderDocRef);
    if (orderDoc.exists() && orderDoc.data().userEmail === userEmail) {
        return { id: orderDoc.id, ...orderDoc.data() };
    }
    return null;
}


async function viewOrderPage({ params }) {
    const session = await getServerSession(authOptions);
    const orderId = params.orderId;
    const order = await fetchOrderData(orderId, session.user.email);

    return (
        <div>
            <Link href="/account/orders">
                <p className="text-blue-500 hover:text-blue-700 hover:underline my-1"> {"<"} Back to Order History</p>
            </Link>
            <h1 className="text-4xl font-medium">Order Details</h1>
        
            <div className="flex flex-col gap-4">
                <div className="divide-y divide-gray-200 mt-6 shadow md:table min-w-full">
                    <div className="bg-gray-50 hidden md:table-header-group">
                        <div className="md:table-row">
                            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">Product</div>
                            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">Quantity</div>
                            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">Subtotal</div>
                        </div>
                    </div>
        
                    <div className="bg-white divide-y divide-gray-200 font-light md:table-row-group rounded-lg">
                        {order.products.map((product, index) => (
                            <div key={index} className="md:table-row">
                                <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                                    <div className="font-medium text-gray-500 uppercase tracking-wider block md:hidden">Product</div>
                                    <Link href={`/products/${product.slug}`} className="text-blue-500 hover:text-blue-700 hover:underline">{product.name}</Link>
                                </div>
                                <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                                    <div className="font-medium text-gray-500 uppercase tracking-wider block md:hidden">Quantity</div>
                                    {product.quantity}
                                </div>
                                <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                                    <div className="font-medium text-gray-500 uppercase tracking-wider block md:hidden">Subtotal</div>
                                    {product.pricePerPiece * product.quantity}
                                </div>
                            </div>
                        ))}
                        <div className="md:table-row">
                            <div className="px-6 py-4 whitespace-nowrap text-right font-medium md:table-cell md:col-span-3">
                                <div className="font-medium text-gray-500 uppercase tracking-wider text-left">Total:</div>
                            </div>
                            <div className="px-6 py-4 whitespace-nowrap md:table-cell text-lg font-medium">{order.total.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
        
                {/* <AddressCard addressId={order.shippingAddress}  />
                <AddressCard addressId={order.billingAddress} /> */}
            </div>
        </div>
    )
}

export default viewOrderPage