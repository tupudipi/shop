import Link from "next/link"
import AddressCard from "@/app/components/AddressCard";

const viewOrderPage = ({ params }) => {
    const orderId = params.orderId;

    const products = [
        { name: "Product 1", code: "ABC123", quantity: 1, subtotal: "$20.00", link: "/products/1" },
        { name: "Product 2", code: "ABC123", quantity: 1, subtotal: "$40.00", link: "/products/2" },
        { name: "Product 3", code: "ABC123", quantity: 1, subtotal: "$30.00", link: "/products/3" }
    ];

    return (
        <div>
            <Link href="/account/orders">
                <p className="text-blue-500 hover:text-blue-700 hover:underline my-1"> {"<"} Back to Order History</p>
            </Link>
            <h1 className="text-4xl font-medium">Order Details</h1>

            <div className="flex flex-col gap-4">

                <table className="min-w-full divide-y divide-gray-200 mt-6 shadow">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Code</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 font-light">
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link href={product.link} className="text-blue-500 hover:text-blue-700 hover:underline">{product.name}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.subtotal}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="3" className="py-4 text-right font-medium">Total:</td>
                            <td>$60.00</td>
                        </tr>
                    </tbody>
                </table>

                <AddressCard isDelivery isInfo/>
                <AddressCard isInfo/>
            </div>
        </div>
    )
}

export default viewOrderPage