import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/firebaseInit";

const fetchOrdersData = async (user_email) => {
  const ordersCollection = collection(db, 'Orders');
  const q = query(ordersCollection, where('userEmail', '==', user_email));
  const querySnapshot = await getDocs(q);
  const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  orders.sort((a, b) => b.orderNumber - a.orderNumber);

  return orders;
}

async function ordersPage() {
  const session = await getServerSession(authOptions);
  const orders = await fetchOrdersData(session.user.email);

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
              <div className={`px-6 py-4 whitespace-nowrap md:table-cell font-medium ${order.status === 'pending' ? 'text-yellow-500' : order.status === 'canceled' ? 'text-red-600' : order.status === 'delivered' ? 'text-green-600' : order.status === 'processing' ? 'text-blue-600' : 'text-purple-600'}`}>
                <div className="font-medium text-gray-500 uppercase tracking-wider md:hidden block">Status</div>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
              <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                <Link href={`/orders/${order.id}`}>
                  <p className="text-blue-500 hover:text-blue-800 hover:underline">View order</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ordersPage;
