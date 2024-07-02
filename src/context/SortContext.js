'use client'

import React, { createContext, useState, useContext } from 'react';

export const SortContext = createContext();

export const SortProvider = ({ children, initialSortType, initialSortOrder }) => {
    const [sortType, setSortType] = useState(initialSortType);
    const [sortOrder, setSortOrder] = useState(initialSortOrder);

    const updateSortType = (newSortType) => {
        setSortType(newSortType);
    };

    const updateSortOrder = (newSortOrder) => {
        setSortOrder(newSortOrder);
    };

    return (
        <SortContext.Provider value={{ sortType, sortOrder, updateSortOrder, updateSortType}}>
            {children}
        </SortContext.Provider>
    );
};