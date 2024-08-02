'use client'

import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc, query, where } from 'firebase/firestore'; import { db } from "@/firebaseInit";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import Toast from '@/app/components/Toast';
import Pagination from '../components/Pagination';
import ConfirmationModal from '@/app/components/ConfirmationModal';

const CategoriesAdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [filterConfig, setFilterConfig] = useState({});
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const inputRef = useRef(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsLoading(true);
    setToastMessage('Checking category usage...');
    try {
      console.log(`Category to delete: ${categoryToDelete.id}`);
      const productsRef = collection(db, 'Products');
      const q = query(productsRef, where("category_id", "==", Number(categoryToDelete.id)));
      const querySnapshot = await getDocs(q);

      console.log(`Query snapshot size: ${querySnapshot.size}`);
      querySnapshot.forEach(doc => console.log(doc.data()));

      if (!querySnapshot.empty) {
        setIsLoading(false);
        setToastMessage(`Error: Cannot delete category. ${querySnapshot.size} product(s) are using this category.`);
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
        return;
      }

      setToastMessage('Deleting category...');
      await deleteDoc(doc(db, 'Categories', categoryToDelete.id));

      const updatedCategories = categories.filter(cat => cat.id !== categoryToDelete.id);
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);

      setIsLoading(false);
      setToastMessage('Category deleted successfully!');
    } catch (error) {
      console.error("Error deleting category: ", error);
      setIsLoading(false);
      setToastMessage('Error deleting category. Please try again.');
    }
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsLoading(true);
    setToastMessage('Adding new category...');
    try {
      const categoriesCollection = collection(db, 'Categories');
      const querySnapshot = await getDocs(categoriesCollection);
      let highestId = 0;
      querySnapshot.forEach((doc) => {
        const id = parseInt(doc.id);
        if (!isNaN(id) && id > highestId) {
          highestId = id;
        }
      });

      const newId = (highestId + 1).toString();

      const newDocRef = doc(db, 'Categories', newId);
      await setDoc(newDocRef, {
        category_name: newCategoryName.trim()
      });

      const newCategory = { id: newId, category_name: newCategoryName.trim() };
      setCategories([...categories, newCategory]);
      setFilteredCategories([...filteredCategories, newCategory]);
      setNewCategoryName('');
      setIsAddingCategory(false);
      setIsLoading(false);
      setToastMessage('New category added successfully!');
    } catch (error) {
      console.error("Error adding document: ", error);
      setIsLoading(false);
      setToastMessage('Error adding category. Please try again.');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastCategory = currentPage * rowsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - rowsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfFirstCategory + rowsPerPage);
  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, 'Categories');
      const querySnapshot = await getDocs(categoriesCollection);
      const fetchedCategories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(fetchedCategories);
      setFilteredCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingCategoryId !== null) {
      inputRef.current?.focus();
    }
  }, [editingCategoryId]);

  useEffect(() => {
    let filtered = [...categories];

    for (const key in filterConfig) {
      if (filterConfig[key]) {
        filtered = filtered.filter(category =>
          category[key].toLowerCase().includes(filterConfig[key].toLowerCase())
        );
      }
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.direction === 'ascending') {
          return a[sortConfig.key].localeCompare(b[sortConfig.key]);
        } else if (sortConfig.direction === 'descending') {
          return b[sortConfig.key].localeCompare(a[sortConfig.key]);
        }
        return 0;
      });
    }

    setFilteredCategories(filtered);
  }, [categories, filterConfig, sortConfig]);

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
    setFilteredCategories(categories);
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

  const handleCategoryChange = async (id, newName) => {
    setIsLoading(true);
    setToastMessage('Saving data...');
    try {
      const categoryRef = doc(db, 'Categories', id);
      await updateDoc(categoryRef, { category_name: newName });

      const updatedCategories = categories.map(cat =>
        cat.id === id ? { ...cat, category_name: newName } : cat
      );
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);

      setIsLoading(false);
      setToastMessage('Category updated successfully!');
      setEditingCategoryId(null);
    } catch (error) {
      console.error("Error updating document: ", error);
      setIsLoading(false);
      setToastMessage('Error updating category. Please try again.');
    }
  };

  const handleEditClick = (category) => {
    setEditingCategoryId(category.id);
    setNewCategoryName(category.category_name);
  };

  const handleSaveClick = (category) => {
    handleCategoryChange(category.id, newCategoryName);
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <span>Category Name</span>
                  <button className="ml-2" onClick={() => handleSort('category_name')}>
                    {renderSortIcon('category_name')}
                  </button>
                  <button className="ml-2" onClick={toggleFilterRow}>
                    {renderSearchIcon('category_name')}
                  </button>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
            {showFilterRow && (
              <tr>
                <th className="px-2 py-1"></th>
                <th className="px-2 py-1">
                  <input
                    type="text"
                    placeholder="Filter by category name"
                    value={filterConfig['category_name'] || ''}
                    onChange={(e) => handleFilterChange('category_name', e.target.value)}
                    className="px-2 py-1 border rounded w-full text-sm font-light"
                  />
                </th>
                <th className="px-2 py-1"></th>
              </tr>
            )}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCategories.map((category, index) => (
              <tr
                key={category.id}
                className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}
              >
                <td className="px-4 py-4 whitespace-nowrap">{category.id}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {editingCategoryId === category.id ? (
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="border rounded px-2 py-1 bg-white w-full"
                      ref={inputRef}
                    />
                  ) : (
                    category.category_name
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {editingCategoryId === category.id ? (
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleSaveClick(category)}
                        className="text-green-600 hover:text-green-800 font-normal"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingCategoryId(null), setNewCategoryName('') }}
                        className="text-gray-700 hover:text-gray-900 font-normal"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleEditClick(category)}
                        className="text-blue-500 hover:text-blue-700 font-normal"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setCategoryToDelete(category);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-500 hover:text-red-700 font-normal"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {isAddingCategory ? (
              <tr>
                <td className="px-4 py-4 whitespace-nowrap">New</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="border rounded px-2 py-1 bg-white w-full"
                    placeholder="Enter new category name"
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className='flex gap-2'>
                    <button
                      onClick={handleAddCategory}
                      className="text-green-600 hover:text-green-800 font-normal"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsAddingCategory(false)}
                      className="text-gray-700 hover:text-gray-900 font-normal"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-4">
                  <button
                    onClick={() => setIsAddingCategory(true)}
                    className="text-blue-500 hover:text-blue-700 font-normal"
                  >
                    Add New Category
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <Toast
        message={toastMessage}
        isLoading={isLoading}
        duration={2000}
        isError={toastMessage.startsWith('Error')}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCategory}
        message={`Are you sure you want to delete the category "${categoryToDelete?.category_name}"? This action cannot be undone. The category will only be deleted if no products are currently using it.`}
      />
    </div>

  );
}

export default CategoriesAdminPage;