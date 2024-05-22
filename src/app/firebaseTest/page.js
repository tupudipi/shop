'use client' 

import React, { useEffect } from 'react';
import { testFirestoreConnection } from '../components/firebaseTest';

const TestComponent = () => {
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  return <div>Check the console for Firestore connection status.</div>;
};

export default TestComponent;
