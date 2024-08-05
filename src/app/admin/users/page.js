'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import Toast from '@/app/components/Toast';
import Pagination from '../components/Pagination';
import ConfirmationModal from '@/app/components/ConfirmationModal';

const UsersAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [filterConfig, setFilterConfig] = useState({});
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isUpdateRoleModalOpen, setIsUpdateRoleModalOpen] = useState(false);
  const [userToUpdateRole, setUserToUpdateRole] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'Users');
      const querySnapshot = await getDocs(usersCollection);
      const fetchedUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: new Date(doc.data().createdAt).toLocaleString()
      }));
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    };

    fetchUsers();
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
        if (sortConfig.key === 'createdAt') {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortConfig.direction === 'ascending' 
            ? dateA - dateB 
            : dateB - dateA;
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

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsLoading(true);
    setToastMessage('Deleting user...');
    try {
      await deleteDoc(doc(db, 'Users', userToDelete.id));

      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      setIsLoading(false);
      setToastMessage('User deleted successfully!');
    } catch (error) {
      console.error("Error deleting user: ", error);
      setIsLoading(false);
      setToastMessage('Error deleting user. Please try again.');
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleUpdateRole = async () => {
    if (!userToUpdateRole || !newRole) return;
    setIsLoading(true);
    setToastMessage('Updating user role...');
    try {
      const userRef = doc(db, 'Users', userToUpdateRole.id);
      await updateDoc(userRef, { role: newRole });

      const updatedUsers = users.map(user =>
        user.id === userToUpdateRole.id ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      setIsLoading(false);
      setToastMessage('User role updated successfully!');
    } catch (error) {
      console.error("Error updating user role: ", error);
      setIsLoading(false);
      setToastMessage('Error updating user role. Please try again.');
    }
    setIsUpdateRoleModalOpen(false);
    setUserToUpdateRole(null);
    setNewRole('');
  };

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
              {renderTableHeader('email', 'Email')}
              {renderTableHeader('name', 'Name')}
              {renderTableHeader('role', 'Role')}
              {renderTableHeader('createdAt', 'Created At')}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
            {showFilterRow && (
              <tr>
                {renderFilterInput('email', 'Filter by email')}
                {renderFilterInput('name', 'Filter by name')}
                {renderFilterInput('role', 'Filter by role')}
                {renderFilterInput('createdAt', 'Filter by creation date')}
                <th className="px-2 py-1"></th>
              </tr>
            )}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map(user => (
              <tr key={user.id}>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{user.createdAt}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => {
                      setUserToUpdateRole(user);
                      setIsUpdateRoleModalOpen(true);
                    }}
                  >
                    Update Role
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      setUserToDelete(user);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete
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

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          message="Are you sure you want to delete this user? This action cannot be undone."
          onConfirm={handleDeleteUser}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}

      {isUpdateRoleModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Update User Role</h3>
            <p className="mb-4">Updating role for user: {userToUpdateRole?.email}</p>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="">Select new role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={() => setIsUpdateRoleModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={!newRole}
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdminPage;