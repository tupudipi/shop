import Link from "next/link";

const ordersPage = () => {
  // Dummy data for table rows
  const orders = [
    { orderNumber: 1, date: '2024-01-01', orderValue: 100, status: 'Pending', link: '/account/orders/1'},
    { orderNumber: 2, date: '2024-01-02', orderValue: 200, status: 'Completed', link: '/account/orders/2'},
    { orderNumber: 3, date: '2024-01-03', orderValue: 150, status: 'Pending', link: '/account/orders/3'}, 
    { orderNumber: 4, date: '2024-01-04', orderValue: 300, status: 'Canceled', link: '/account/orders/3'}, 
  ];

  return (
    <div>
      <h1 className="text-4xl font-medium">Orders</h1>
      
      <table className="min-w-full divide-y divide-gray-200 mt-6 shadow">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Value</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 font-light">
          {orders.map((order) => (
            <tr key={order.orderNumber}>
              <td className="px-6 py-4 whitespace-nowrap">{order.orderNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.orderValue}</td>
              <td className={`px-6 py-4 whitespace-nowrap ${order.status === 'Pending' ? 'text-yellow-500' : order.status === 'Canceled' ? 'text-red-500' : 'text-green-500'}`}>{order.status}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={order.link}>
                  <p className="text-blue-500 hover:text-blue-800 underline">View order</p>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default ordersPage;