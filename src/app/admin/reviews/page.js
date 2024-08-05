'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import Toast from '@/app/components/Toast';
import Pagination from '../components/Pagination';
import ConfirmationModal from '@/app/components/ConfirmationModal';

const ReviewsAdminPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [filterConfig, setFilterConfig] = useState({});
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    setIsLoading(true);
    setToastMessage('Deleting review...');
    try {
      await deleteDoc(doc(db, 'Reviews', reviewToDelete.id));

      const updatedReviews = reviews.filter(rev => rev.id !== reviewToDelete.id);
      setReviews(updatedReviews);
      setFilteredReviews(updatedReviews);

      setIsLoading(false);
      setToastMessage('Review deleted successfully!');
    } catch (error) {
      console.error("Error deleting review: ", error);
      setIsLoading(false);
      setToastMessage('Error deleting review. Please try again.');
    }
    setIsDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  const handleFlagReview = async (id) => {
    setIsLoading(true);
    setToastMessage('Flagging review...');
    try {
      const reviewRef = doc(db, 'Reviews', id);
      await updateDoc(reviewRef, { flagged: true });

      const updatedReviews = reviews.map(rev =>
        rev.id === id ? { ...rev, flagged: true } : rev
      );
      setReviews(updatedReviews);
      setFilteredReviews(updatedReviews);

      setIsLoading(false);
      setToastMessage('Review flagged successfully!');
    } catch (error) {
      console.error("Error flagging review: ", error);
      setIsLoading(false);
      setToastMessage('Error flagging review. Please try again.');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastReview = currentPage * rowsPerPage;
  const indexOfFirstReview = indexOfLastReview - rowsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfFirstReview + rowsPerPage);
  const totalPages = Math.ceil(filteredReviews.length / rowsPerPage);


  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsCollection = collection(db, 'Reviews');
      const querySnapshot = await getDocs(reviewsCollection);
      const fetchedReviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(fetchedReviews);
      setFilteredReviews(fetchedReviews);
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    let filtered = [...reviews];

    for (const key in filterConfig) {
      if (filterConfig[key]) {
        filtered = filtered.filter(review =>
          String(review[key]).toLowerCase().includes(filterConfig[key].toLowerCase())
        );
      }
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === 'grade') {
          return sortConfig.direction === 'ascending'
            ? a.grade - b.grade
            : b.grade - a.grade;
        }
        if (sortConfig.key === 'date') {
          // Convert date strings to Date objects for comparison
          const dateA = new Date(a.date.split('/').reverse().join('-'));
          const dateB = new Date(b.date.split('/').reverse().join('-'));
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

    setFilteredReviews(filtered);
  }, [reviews, filterConfig, sortConfig]);


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
    setFilteredReviews(reviews);
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
              {renderTableHeader('id', 'ID')}
              {renderTableHeader('author', 'Author')}
              {renderTableHeader('content', 'Content')}
              {renderTableHeader('grade', 'Grade')}
              {renderTableHeader('product_id', 'Product ID')}
              {renderTableHeader('date', 'Date')}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
            {showFilterRow && (
              <tr>
                {renderFilterInput('id', 'Filter by ID')}
                {renderFilterInput('author', 'Filter by author')}
                {renderFilterInput('content', 'Filter by content')}
                {renderFilterInput('grade', 'Filter by grade')}
                {renderFilterInput('product_id', 'Filter by product ID')}
                {renderFilterInput('date', 'Filter by date')}
                <th className="px-2 py-1"></th>
              </tr>
            )}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentReviews.map(review => (
              <tr key={review.id}>
                <td className="px-4 py-2">{review.id}</td>
                <td className="px-4 py-2">{review.author}</td>
                <td className="px-4 py-2">{review.content}</td>
                <td className="px-4 py-2">{review.grade}</td>
                <td className="px-4 py-2">{review.product_id}</td>
                <td className="px-4 py-2">{review.date}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => handleFlagReview(review.id)}
                    disabled={review.flagged}
                  >
                    {review.flagged ? 'Flagged' : 'Flag'}
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      setReviewToDelete(review);
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
          message="Are you sure you want to delete this review? This action cannot be undone."
          onConfirm={handleDeleteReview}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ReviewsAdminPage;
