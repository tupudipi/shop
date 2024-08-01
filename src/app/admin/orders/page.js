'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import Toast from '@/app/components/Toast';
import Pagination from '../components/Pagination';

const OrdersAdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [filterConfig, setFilterConfig] = useState({});
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastOrder = currentPage * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, 'Orders');
      const querySnapshot = await getDocs(ordersCollection);
      const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    for (const key in filterConfig) {
      if (filterConfig[key]) {
        filtered = filtered.filter(order =>
          order[key]?.toString().toLowerCase().includes(filterConfig[key].toLowerCase())
        );
      }
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredOrders(filtered);
  }, [filterConfig, sortConfig, orders]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : '';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilterConfig(prev => ({ ...prev, [key]: value }));
  };

  const clearFiltersAndSorting = () => {
    setSortConfig({ key: '', direction: '' });
    setFilterConfig({});
    setFilteredOrders(orders);
  };

  const toggleFilterRow = () => {
    setShowFilterRow(!showFilterRow);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} />;
    if (sortConfig.direction === 'ascending') return <FontAwesomeIcon icon={faSortUp} className="text-blue-500" />;
    if (sortConfig.direction === 'descending') return <FontAwesomeIcon icon={faSortDown} className="text-blue-500" />;
    return <FontAwesomeIcon icon={faSort} />;
  };

  const renderSearchIcon = (key) => {
    const isFiltered = filterConfig[key] && filterConfig[key].length > 0;
    return <FontAwesomeIcon icon={faSearch} className={isFiltered ? 'text-blue-500' : ''} />;
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSave = async (updatedOrder) => {
    setIsLoading(true);
    setToastMessage('Saving data...');
    try {
        const orderRef = doc(db, 'Orders', updatedOrder.id);
        await updateDoc(orderRef, updatedOrder);

        const updatedOrders = orders.map(order =>
            order.id === updatedOrder.id ? updatedOrder : order
        );
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);

        setIsModalOpen(false);
        setSelectedOrder(null);

        setIsLoading(false);
        setToastMessage('Order updated successfully!');
    } catch (error) {
        console.error("Error updating document: ", error);
        setIsLoading(false);
        setToastMessage('Error updating order. Please try again.');
    }
};


  const orderKeys = ['orderNumber', 'userEmail', 'total', 'status', 'paymentMethod', 'createdAt'];

  return (
    <div className="max-w-full overflow-hidden px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
        <button
          className={`border ${Object.keys(filterConfig).length === 0 && sortConfig.key === '' ? 'border-gray-300 text-gray-300 cursor-not-allowed' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'} px-4 py-1 rounded-lg transition-all`}
          onClick={clearFiltersAndSorting}
          disabled={Object.keys(filterConfig).length === 0 && sortConfig.key === ''}
        >
          Clear Filters & Sorting
        </button>
        <div className="flex items-center">
          <label htmlFor="rowsPerPage" className="mr-2">Rows per page:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border rounded px-2 py-1"
          >
            {[5, 10, 20, 50].map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {orderKeys.map(key => (
                <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    <button className="ml-2" onClick={() => handleSort(key)}>
                      {renderSortIcon(key)}
                    </button>
                    <button className="ml-2" onClick={toggleFilterRow}>
                      {renderSearchIcon(key)}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
            {showFilterRow && (
              <tr>
                {orderKeys.map(key => (
                  <th key={key} className="px-2 py-1">
                    <input
                      type="text"
                      placeholder={`Filter by ${key}`}
                      value={filterConfig[key] || ''}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                      className="px-2 py-1 border rounded w-full text-sm font-light"
                    />
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map((order, index) => (
              <tr
                key={order.id}
                className={`cursor-pointer ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}
                onClick={() => handleRowClick(order)}
              >
                <td className="px-4 py-4 whitespace-nowrap">{order.orderNumber}</td>
                <td className="px-4 py-4 whitespace-nowrap">{order.userEmail}</td>
                <td className="px-4 py-4 whitespace-nowrap">{order.total}</td>
                <td className="px-4 py-4 whitespace-nowrap">{order.status}</td>
                <td className="px-4 py-4 whitespace-nowrap">{order.paymentMethod}</td>
                <td className="px-4 py-4 whitespace-nowrap">{new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        order={selectedOrder || {}}
        onSave={handleSave}
      />
      
      <Toast 
        message={toastMessage} 
        isLoading={isLoading} 
        duration={3000}
      />
    </div>
  );
};

export default OrdersAdminPage;
