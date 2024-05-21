import Link from "next/link";

const ordersPage = () => {
  const orders = [
    { orderNumber: 1, date: '2024-01-01', orderValue: 100, status: 'Pending', link: '/account/orders/1'},
    { orderNumber: 2, date: '2024-01-02', orderValue: 200, status: 'Completed', link: '/account/orders/2'},
    { orderNumber: 3, date: '2024-01-03', orderValue: 150, status: 'Pending', link: '/account/orders/3'}, 
    { orderNumber: 4, date: '2024-01-04', orderValue: 300, status: 'Canceled', link: '/account/orders/3'}, 
  ];

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
            <div key={order.orderNumber} className="md:table-row">
              <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                <div className="font-medium text-gray-500 uppercase tracking-wider md:hidden block">Order #</div>
                {order.orderNumber}
              </div>
              <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                <div className="font-medium text-gray-500 uppercase tracking-wider md:hidden block">Date</div>
                {order.date}
              </div>
              <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                <div className="font-medium text-gray-500 uppercase tracking-wider md:hidden block">Order Value</div>
                {order.orderValue}
              </div>
              <div className={`px-6 py-4 whitespace-nowrap md:table-cell ${order.status === 'Pending' ? 'text-yellow-500' : order.status === 'Canceled' ? 'text-red-500' : 'text-green-500'}`}>
                <div className="font-medium text-gray-500 uppercase tracking-wider md:hidden block">Status</div>
                {order.status}
              </div>
              <div className="px-6 py-4 whitespace-nowrap md:table-cell">
                <Link href={order.link}>
                  <p className="text-blue-500 hover:text-blue-800 underline">View order</p>
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