'use client'

import React, { createContext, useState, useContext } from 'react';

const ReviewContext = createContext();

export const useReview = () => useContext(ReviewContext);

export const ReviewProvider = ({ children }) => {
  const [reviewValue, setReviewValue] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const updateReview = (value, count) => {
    setReviewValue(value);
    setReviewCount(count);
  };

  return (
    <ReviewContext.Provider value={{ reviewValue, reviewCount, updateReview }}>
      {children}
    </ReviewContext.Provider>
  );
};