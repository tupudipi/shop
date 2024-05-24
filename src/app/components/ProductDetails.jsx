'use client'

import { useState, useEffect } from 'react';
import ProductComments from './ProductComments';
import styles from './topBarStyle.module.css';

const ProductDetails = ({ description }) => {
  const [activeSection, setActiveSection] = useState('description');

  useEffect(() => {
    const handleScroll = () => {
      const descriptionElement = document.getElementById('description');
      const reviewsElement = document.getElementById('reviews');

      if (window.pageYOffset >= reviewsElement.offsetTop) {
        setActiveSection('reviews');
      } else if (window.pageYOffset >= descriptionElement.offsetTop) {
        setActiveSection('description');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="sticky top-0 z-10">
        <div id='top-bar' className={`relative flex bg-blue-600 p-2 ${styles.topBar}`}>
          <a
            href="#description"
            className={`transition-all mr-4 p-2  ${activeSection === 'description' ? 'text-blue-800 font-semibold bg-white rounded-md' : 'text-white'}`}
          >
            Description
          </a>
          <a
            href="#reviews"
            className={`transition-all p-2 ${activeSection === 'reviews' ? 'text-blue-800 font-semibold bg-white rounded-md' : 'text-white'}`}
          >
            Reviews
          </a>
        </div>
      </div>
      <div id="description" className='mb-8'>
        <h2 className='text-2xl my-4'>Product Details</h2>
        <p className='text-gray-800 leading-7 text-sm'>{description}</p>
      </div>
      <div id="reviews" className='bg-white/70 py-4 px-8 rounded-lg shadow'>
        <h2 className='text-2xl my-4'>Reviews</h2>
        <ProductComments />
      </div>
    </div>
  );
};

export default ProductDetails;