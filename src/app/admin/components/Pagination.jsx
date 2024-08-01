// components/Pagination.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages - 1);
    }

    if (currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - 4, 2);
    }

    return pageNumbers.slice(startPage - 1, endPage).map(number => (
      <button
        key={number}
        onClick={() => onPageChange(number)}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        {number}
      </button>
    ));
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <button
        onClick={() => onPageChange(1)}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        1
      </button>
      {currentPage > 3 && <span className="mx-1">...</span>}
      {renderPageNumbers()}
      {currentPage < totalPages - 2 && <span className="mx-1">...</span>}
      {totalPages > 1 && (
        <button
          onClick={() => onPageChange(totalPages)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {totalPages}
        </button>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
};

export default Pagination;