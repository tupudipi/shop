'use client'

import React, { createContext, useState, useContext } from 'react';

const ReviewContext = createContext();

export const useReview = () => useContext(ReviewContext);

export const ReviewProvider = ({ children, initialReviewValue = 0, initialReviewCount = 0 }) => {
  const [reviewValue, setReviewValue] = useState(initialReviewValue);
  const [reviewCount, setReviewCount] = useState(initialReviewCount);

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