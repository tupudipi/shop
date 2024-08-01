import Link from "next/link"
import AddressCard from "@/app/components/AddressCard";
import { db } from "@/firebaseInit";
import { doc, getDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Image from "next/image";

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
            <h1 className="text-4xl font-medium mb-4">Order Details</h1>
            <div>
                <h2 className="text-2xl mb-2 align-middle">Order #{order.orderNumber} <span className={` ${order.status === 'pending' ? 'bg-yellow-500' : order.status === 'Canceled' ? 'bg-red-600' : order.status === 'Delivered' ? 'bg-green-600' : order.status === 'Processing' ? 'bg-blue-600' : 'bg-purple-600'} text-white font-semibold p-1 rounded text-sm align-middle`}>{order.status}</span></h2>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl">Products:</h3>
                        <div className="divide-y divide-gray-200 shadow md:table min-w-full">
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
                                            <Link href={`/products/${product.slug}`} className="text-blue-500 hover:text-blue-700 hover:underline">
                                                <div className="flex items-center gap-2">
                                                    <Image src={product.image} alt={product.name} width={50} height={50} />
                                                    <span>{product.name}</span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="px-6 py-4 whitespace-nowrap md:table-cell md:text-center align-middle">
                                            <div className="font-medium text-gray-500 uppercase tracking-wider block md:hidden">Quantity</div>
                                            {product.quantity}
                                        </div>
                                        <div className="px-6 py-4 whitespace-nowrap md:table-cell md:text-center align-middle">
                                            <div className="font-medium text-gray-500 uppercase tracking-wider block md:hidden">Subtotal</div>
                                            {product.pricePerPiece * product.quantity}
                                        </div>
                                    </div>
                                ))}
                                <div className="md:table-row">
                                    <div className="px-6 py-4 whitespace-nowrap text-right font-medium md:table-cell">
                                        <div className="font-medium text-gray-500 uppercase tracking-wider text-left">Total:</div>
                                    </div>
                                    <div className="px-6 py-4 whitespace-nowrap hidden md:table-cell text-lg font-medium"></div>
                                    <div className="px-6 py-4 whitespace-nowrap md:table-cell text-lg font-medium table text-center">{order.total.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-2xl mb-4">Order Status History</h3>
                            <div className="border-l-2 border-gray-200 ml-4">
                                {order.statusHistory.map((status, index) => (
                                    <div key={index} className="mb-6 relative">
                                        <div className={`absolute -left-2 mt-2 w-4 h-4 rounded-full ${status.status === 'pending' ? 'bg-yellow-500' :
                                            status.status === 'Canceled' ? 'bg-red-600' :
                                                status.status === 'Delivered' ? 'bg-green-600' :
                                                    status.status === 'Processing' ? 'bg-blue-600' : 'bg-purple-600'
                                            }`}></div>
                                        <div className="ml-6">
                                            <p className="font-semibold">{status.status.charAt(0).toUpperCase() + status.status.slice(1)}</p>
                                            <p className="text-sm text-gray-500">{new Date(status.timestamp).toLocaleString()}</p>
                                            <p className="text-sm">{status.note}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl">Shipping Address</h3>
                        <div className="border p-4 rounded shadow bg-white">
                            <p>Full Name: {order.shippingAddress.firstname} {order.shippingAddress.surname}</p>
                            <p>Phone Number: {order.billingAddress.phone}</p>
                            <p>E-mail: {order.billingAddress.user_email}</p>
                            <p>Address: {order.shippingAddress.address}</p>
                            <p>City: {order.shippingAddress.city}</p>
                            <p>County: {order.shippingAddress.county}</p>
                        </div>

                        <h3 className="text-xl">Billing Address</h3>
                        <div className="border p-4 rounded shadow bg-white">
                            <p>Full Name: {order.billingAddress.firstname} {order.billingAddress.surname}</p>
                            <p>Phone Number: {order.billingAddress.phone}</p>
                            <p>E-mail: {order.billingAddress.user_email}</p>
                            <p>Address: {order.billingAddress.address}</p>
                            <p>City: {order.billingAddress.city}</p>
                            <p>County: {order.billingAddress.county}</p>
                        </div>

                        <h3 className="text-xl">Payment Method</h3>
                        <p>{order.paymentMethod}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default viewOrderPage