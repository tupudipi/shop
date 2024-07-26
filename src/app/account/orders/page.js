import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function OrdersPage() {
  const session = await getServerSession(authOptions);
  
  // Fetch orders from the API route
  const orders = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getOrders?email=${session.user.email}`, { 
    cache: 'no-store',
    next: { revalidate: 0 }
  }).then(res => res.json());

  // Sort orders
  orders.sort((a, b) => {
    const timeComparison = b.createdAt.seconds - a.createdAt.seconds;
    if (timeComparison !== 0) return timeComparison;
    return b.orderNumber.localeCompare(a.orderNumber);
  });

  return (
    <div>
      <h1 className="text-4xl font-medium">Orders</h1>
      
      <div className="divide-y divide-gray-200 mt-6 shadow md:table min-w-full">
        <div className="bg-gray-50 hidden md:table-header-group">
          <div className="md:table-row">
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">Order #</div>
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">Date</div>
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">Order Value</div>
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">Status</div>
            <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell"></div>
          </div>
        </div>
        
        <div className="bg-white divide-y divide-gray-200 font-light md:table-row-group rounded-lg">
          {orders.map((order) => (
            <div key={order.id} className="md:table-row">
              <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                <div className="font-medium text-gray-500 uppercase tracking-wider md:hidden block">Order #</div>
                {order.orderNumber}
              </div>
              <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                <div className="font-medium text-gray-500 uppercase tracking-wider md:hidden block">Date</div>
                {new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-GB')}
              </div>
              <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                <div className="font-medium text-gray-500 uppercase tracking-wider md:hidden block">Order Value</div>
                ${order.total.toFixed(2)}
              </div>
              <div className={`px-6 py-4 whitespace-nowrap md:table-cell font-medium ${
                order.status === 'pending' ? 'text-yellow-500' : 
                order.status === 'canceled' ? 'text-red-600' : 
                order.status === 'delivered' ? 'text-green-600' : 
                order.status === 'processing' ? 'text-blue-600' : 'text-purple-600'
              }`}>
                <div className="font-medium text-gray-500 uppercase tracking-wider md:hidden block">Status</div>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
              <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                <Link href={`/account/orders/${order.id}`}>
                  <p className="text-blue-500 hover:text-blue-800 hover:underline">View order</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;