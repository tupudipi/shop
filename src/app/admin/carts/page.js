'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort, faSearch, faEye } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';

const CartsAdminPage = () => {
  const [carts, setCarts] = useState({});
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [filterConfig, setFilterConfig] = useState({});
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchCarts = async () => {
      const cartsCollection = collection(db, 'Carts');
      const querySnapshot = await getDocs(cartsCollection);
      const cartData = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!cartData[data.user_id]) {
          cartData[data.user_id] = [];
        }
        cartData[data.user_id].push(data);
      });
      setCarts(cartData);
      setUsers(Object.keys(cartData).map(user_id => ({
        user_id,
        itemCount: cartData[user_id].length,
        totalValue: cartData[user_id].reduce((sum, item) => sum + (item.price * item.quantity), 0)
      })));
      setFilteredUsers(Object.keys(cartData).map(user_id => ({
        user_id,
        itemCount: cartData[user_id].length,
        totalValue: cartData[user_id].reduce((sum, item) => sum + (item.price * item.quantity), 0)
      })));
    };

    fetchCarts();
  }, []);

  useEffect(() => {
    let filtered = [...users];

    for (const key in filterConfig) {
      if (filterConfig[key]) {
        filtered = filtered.filter(user =>
          String(user[key]).toLowerCase().includes(filterConfig[key].toLowerCase())
        );
      }
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === 'itemCount') {
          return sortConfig.direction === 'ascending'
            ? a.itemCount - b.itemCount
            : b.itemCount - a.itemCount;
        }
        if (sortConfig.direction === 'ascending') {
          return String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]));
        } else if (sortConfig.direction === 'descending') {
          return String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]));
        }
        return 0;
      });
    }

    setFilteredUsers(filtered);
  }, [users, filterConfig, sortConfig]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = '';
      } else {
        direction = 'ascending';
      }
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilterConfig(prev => ({ ...prev, [key]: value }));
  };

  const clearFiltersAndSorting = () => {
    setSortConfig({ key: '', direction: '' });
    setFilterConfig({});
    setFilteredUsers(users);
  };

  const toggleFilterRow = () => {
    setShowFilterRow(!showFilterRow);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FontAwesomeIcon icon={faSort} />;
    }
    if (sortConfig.direction === 'ascending') {
      return <FontAwesomeIcon icon={faSortUp} className="text-blue-500" />;
    }
    if (sortConfig.direction === 'descending') {
      return <FontAwesomeIcon icon={faSortDown} className="text-blue-500" />;
    }
    return <FontAwesomeIcon icon={faSort} />;
  };

  const renderSearchIcon = (key) => {
    const isFiltered = filterConfig[key] && filterConfig[key].length > 0;
    return <FontAwesomeIcon icon={faSearch} className={isFiltered ? 'text-blue-500' : ''} />;
  };

  const renderTableHeader = (key, label) => (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <div className="flex items-center">
        <span>{label}</span>
        <button className="ml-2" onClick={() => handleSort(key)}>
          {renderSortIcon(key)}
        </button>
        <button className="ml-2" onClick={toggleFilterRow}>
          {renderSearchIcon(key)}
        </button>
      </div>
    </th>
  );

  const renderFilterInput = (key, placeholder) => (
    <th className="px-2 py-1">
      <input
        type="text"
        placeholder={placeholder}
        value={filterConfig[key] || ''}
        onChange={e => handleFilterChange(key, e.target.value)}
        className="border rounded px-2 py-1 w-full"
      />
    </th>
  );

  const openCartModal = (user) => {
    setSelectedUser(user);
    setIsCartModalOpen(true);
  };

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
              {renderTableHeader('user_id', 'User Email')}
              {renderTableHeader('itemCount', 'Items in Cart')}
              {renderTableHeader('totalValue', 'Total Cart Value')}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
            {showFilterRow && (
              <tr>
                {renderFilterInput('user_id', 'Filter by email')}
                {renderFilterInput('itemCount', 'Filter by item count')}
                {renderFilterInput('totalValue', 'Filter by total value')}
                <th className="px-2 py-1"></th>
              </tr>
            )}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.user_id}>
                <td className="px-4 py-2">{user.user_id}</td>
                <td className="px-4 py-2">{user.itemCount}</td>
                <td className="px-4 py-2">${user.totalValue.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => openCartModal(user)}
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    View Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {isCartModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Cart for {selectedUser.user_id}
            </h3>
            <div className="mt-2 max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {carts[selectedUser.user_id].map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={item.image} alt={item.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-lg font-semibold">
                Total: ${selectedUser.totalValue.toFixed(2)}
              </div>
              <button
                onClick={() => setIsCartModalOpen(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartsAdminPage;