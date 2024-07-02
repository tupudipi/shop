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
    console.log(e.target.value);
  }

  const handleOrderChange = (e) => {
    updateSortOrder(e.target.value);
    console.log(e.target.value);
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col md:flex-row w-full container mx-auto">
        <div className="text-center md:min-w-1/4 p-4">
          <FiltersClient />
        </div>
        <div className="flex-grow text-center p-4">
          <div id="sorting">
            <div className="md:flex md:flex-row md:justify-around">
              <div className="md:flex md:flex-row md:items-center mb-2 md:mb-0">
                <label htmlFor="sort" className="mr-2">Sort by:</label>
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
              <div className="md:flex md:flex-row md:items-center mb-2 md:mb-0">
                <label htmlFor="order" className="mr-2">Order:</label>
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
          {children}
        </div>
      </main>
    </>
  );
}