'use client' 

import React, { useEffect } from 'react';
import { seedProducts } from '../components/firebaseTest';

const TestComponent = () => {
  useEffect(() => {
    seedProducts();
  }, []);

  return <div>Check the console for Firestore connection status.</div>;
};

export default TestComponent;
