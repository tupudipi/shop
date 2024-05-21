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
                <div className="divide-y divide-gray-200 mt-6 shadow md:table min-w-full">
                    <div className="bg-gray-50 hidden md:table-header-group">
                        <div className="md:table-row">
                            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">Product</div>
                            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">Product Code</div>
                            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">Quantity</div>
                            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">Price</div>
                        </div>
                    </div>

                    <div className="bg-white divide-y divide-gray-200 font-light md:table-row-group rounded-lg">
                        {products.map((product, index) => (
                            <div key={index} className="md:table-row">
                                <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                                    <div className="font-medium text-gray-500 uppercase tracking-wider block md:hidden">Product</div>
                                    <Link href={product.link} className="text-blue-500 hover:text-blue-700 hover:underline">{product.name}</Link>
                                </div>
                                <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                                    <div className="font-medium text-gray-500 uppercase tracking-wider block md:hidden">Product Code</div>
                                    {product.code}
                                </div>
                                <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                                    <div className="font-medium text-gray-500 uppercase tracking-wider block md:hidden">Quantity</div>
                                    {product.quantity}
                                </div>
                                <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                                    <div className="font-medium text-gray-500 uppercase tracking-wider block md:hidden">Price</div>
                                    {product.subtotal}
                                </div>
                            </div>
                        ))}
                        <div className="md:table-row">
                            <div className="px-6 py-4 whitespace-nowrap text-right font-medium md:table-cell md:col-span-3">
                                <div className="font-medium text-gray-500 uppercase tracking-wider text-left">Total:</div>
                            </div>
                            <div className="px-6 py-4 whitespace-nowrap md:table-cell text-lg font-medium">$60.00</div>
                        </div>
                    </div>
                </div>

                <AddressCard isDelivery isInfo/>
                <AddressCard isInfo/>
            </div>
        </div>
    )
}

export default viewOrderPage