'use client'
import { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import FiltersClient from '../components/FiltersClient';
import { SortProvider, SortContext } from '@/context/SortContext';

export default function RootLayout({ children }) {
  return (
    <SortProvider initialSortType="name" initialSortOrder="asc">
      <LayoutContent>{children}</LayoutContent>
    </SortProvider>
  );
}

function LayoutContent({ children }) {
  const { sortType, sortOrder, updateSortType, updateSortOrder } = useContext(SortContext);
  const handleSortChange = (e) => {
    updateSortType(e.target.value);
  }
  const handleOrderChange = (e) => {
    updateSortOrder(e.target.value);
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row flex-grow overflow-y-auto md:overflow-hidden">
        <div className="md:w-1/5 p-4 py-1 md:overflow-y-auto">
          <FiltersClient />
        </div>
        <div className="flex-grow flex flex-col md:overflow-y-auto">
          <div id="sorting" className="p-4 py-1 bg-slate-100 z-10 md:sticky md:top-0">
            <div className="flex flex-col md:flex-row md:justify-around">
              <div className="flex flex-col md:flex-row md:items-center mb-2 md:mb-0">
                <label htmlFor="sort" className="mr-2 mb-1 md:mb-0">Sort by:</label>
                <select
                  name="sort"
                  id="sort"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={sortType}
                  onChange={handleSortChange}
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="reviewNumber">Number of reviews</option>
                </select>
              </div>
              <div className="flex flex-col md:flex-row md:items-center mb-2 md:mb-0">
                <label htmlFor="order" className="mr-2 mb-1 md:mb-0">Order:</label>
                <select
                  name="order"
                  id="order"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={sortOrder}
                  onChange={handleOrderChange}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-4 pt-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}