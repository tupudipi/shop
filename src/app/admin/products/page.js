'use client'

import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import Toast from '@/app/components/Toast';
import Pagination from '../components/Pagination';
import ConfirmationModal from '@/app/components/ConfirmationModal';
import Image from 'next/image';

const ProductsAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [filterConfig, setFilterConfig] = useState({});
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingProductId, setEditingProductId] = useState(null);
  const [newProductData, setNewProductData] = useState({ name: '', description: '', image: '', category_id: '', price: 0 });
  const inputRef = useRef(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, 'Categories');
      const querySnapshot = await getDocs(categoriesCollection);
      const fetchedCategories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(fetchedCategories);
      setCategories(fetchedCategories);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsLoading(true);
    setToastMessage('Deleting product...');
    try {
      await deleteDoc(doc(db, 'Products', productToDelete.id));

      const updatedProducts = products.filter(prod => prod.id !== productToDelete.id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);

      setIsLoading(false);
      setToastMessage('Product deleted successfully!');
    } catch (error) {
      console.error("Error deleting product: ", error);
      setIsLoading(false);
      setToastMessage('Error deleting product. Please try again.');
    }
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleAddProduct = async () => {
    const { name, description, image, category_id, price } = newProductData;
    if (!name.trim() || !description.trim() || !image.trim() || !category_id.trim() || !price) return;
    setIsLoading(true);
    setToastMessage('Adding new product...');
    try {
      const slug = name.trim().toLowerCase().replace(/ /g, '-');
      const newDocRef = doc(db, 'Products', slug);

      await setDoc(newDocRef, {
        category_id: Number(category_id),
        description: description.trim(),
        image: image.trim(),
        name: name.trim(),
        price: Number(price),
        reviewCount: 0,
        reviewValue: 0,
        slug,
        stock: 0
      });

      const newProduct = { id: slug, category_id: Number(category_id), description: description.trim(), image: image.trim(), name: name.trim(), price: Number(price), reviewCount: 0, reviewValue: 0, slug, stock: 0 };
      setProducts([...products, newProduct]);
      setFilteredProducts([...filteredProducts, newProduct]);
      setNewProductData({ name: '', description: '', image: '', category_id: '', price: 0 });
      setIsAddingProduct(false);
      setIsLoading(false);
      setToastMessage('New product added successfully!');
    } catch (error) {
      console.error("Error adding product: ", error);
      setIsLoading(false);
      setToastMessage('Error adding product. Please try again.');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfFirstProduct + rowsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'Products');
      const querySnapshot = await getDocs(productsCollection);
      const fetchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (editingProductId !== null) {
      inputRef.current?.focus();
    }
  }, [editingProductId]);

  useEffect(() => {
    let filtered = [...products];
  
    for (const key in filterConfig) {
      if (filterConfig[key]) {
        if (key === 'category') {
          filtered = filtered.filter(product =>
            filterConfig[key].includes(product.category_id)
          );
        } else {
          filtered = filtered.filter(product =>
            product[key].toLowerCase().includes(filterConfig[key].toLowerCase())
          );
        }
      }
    }
  
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === 'category') {
          const categoryA = categories.find(category => category.id === a.category_id)?.category_name || '';
          const categoryB = categories.find(category => category.id === b.category_id)?.category_name || '';
          if (sortConfig.direction === 'ascending') {
            return categoryA.localeCompare(categoryB);
          } else if (sortConfig.direction === 'descending') {
            return categoryB.localeCompare(categoryA);
          }
        } else {
          if (sortConfig.direction === 'ascending') {
            return a[sortConfig.key].localeCompare(b[sortConfig.key]);
          } else if (sortConfig.direction === 'descending') {
            return b[sortConfig.key].localeCompare(a[sortConfig.key]);
          }
        }
        return 0;
      });
    }
  
    setFilteredProducts(filtered);
  }, [products, filterConfig, sortConfig, categories]);

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

  const renderFilterRow = () => {
    if (!showFilterRow) return null;

    return (
      <tr>
        {productKeys.map((key) => (
          <th key={key}>
            <input
              type="text"
              placeholder={`Filter by ${key}`}
              value={filterConfig[key] || ''}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="border rounded px-2 py-1"
            />
          </th>
        ))}
      </tr>
    );
  };

  const handleFilterChange = (key, value) => {
    if (key === 'category') {
      const filteredCategoryIds = categories
        .filter(category => category.category_name.toLowerCase().includes(value.toLowerCase()))
        .map(category => category.id);
      setFilterConfig(prev => ({ ...prev, [key]: filteredCategoryIds }));
    } else {
      setFilterConfig(prev => ({ ...prev, [key]: value }));
    }
  };

  const clearFiltersAndSorting = () => {
    setSortConfig({ key: '', direction: '' });
    setFilterConfig({});
    setFilteredProducts(products);
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

  const handleProductChange = async (id, updatedData) => {
    setIsLoading(true);
    setToastMessage('Saving data...');
    try {
      const productRef = doc(db, 'Products', id);
      await updateDoc(productRef, updatedData);

      const updatedProducts = products.map(prod =>
        prod.id === id ? { ...prod, ...updatedData } : prod
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);

      setIsLoading(false);
      setToastMessage('Product updated successfully!');
      setEditingProductId(null);
    } catch (error) {
      console.error("Error updating product: ", error);
      setIsLoading(false);
      setToastMessage('Error updating product. Please try again.');
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setNewProductData({
      name: product.name,
      description: product.description,
      image: product.image,
      category_id: product.category_id.toString(),
      price: product.price
    });
  };

  const handleSaveClick = (product) => {
    const updatedData = {
      name: newProductData.name,
      description: newProductData.description,
      image: newProductData.image,
      category_id: Number(newProductData.category_id),
      price: Number(newProductData.price)
    };
    handleProductChange(product.id, updatedData);
  };

  const productKeys = ['id', 'name', 'description', 'image', 'category', 'price'];

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
      <div className='overflow-x-auto'>
        <table className="min-w-full divide-y divide-gray-200 text-sm overflow-x-auto">
          <thead className='bg-gray-50'>
            <tr>
              {productKeys.map(key => (
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
            {showFilterRow && renderFilterRow()}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {editingProductId === product.id ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={newProductData.name}
                      onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {editingProductId === product.id ? (
                    <input
                      type="text"
                      value={newProductData.description}
                      onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {editingProductId === product.id ? (
                    <input
                      type="text"
                      value={newProductData.image}
                      onChange={(e) => setNewProductData({ ...newProductData, image: e.target.value })}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    <Image width={40} height={40} src={product.image} alt={product.name} className="h-10 w-10 object-cover" />
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {editingProductId === product.id ? (
                    <select
                      id="category"
                      value={newProductData.category_id}
                      onChange={(e) => setNewProductData({ ...newProductData, category_id: e.target.value })}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.category_name || 'Unknown'}
                        </option>
                      ))}
                    </select>
                  ) : (
                    categories.find(category => Number(category.id) === Number(product.category_id))?.category_name || 'Unknown'
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {editingProductId === product.id ? (
                    <input
                      type="number"
                      value={newProductData.price}
                      onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {editingProductId === product.id ? (
                    <button
                      onClick={() => handleSaveClick(product)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setProductToDelete(product);
                    }}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      <Toast message={toastMessage} isLoading={isLoading} />
      {isDeleteModalOpen && (
        <ConfirmationModal
          message={`Are you sure you want to delete product "${productToDelete.name}"?`}
          onConfirm={handleDeleteProduct}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ProductsAdminPage;
