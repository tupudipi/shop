'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/firebaseInit";  // Adjust the path to your firebaseInit
import ReviewCard from './ReviewCard';

const ProductComments = ({ slug }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsCollection = collection(db, 'Reviews');
        const q = query(reviewsCollection, where('product_id', '==', slug));
        const querySnapshot = await getDocs(q);
        const fetchedReviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(fetchedReviews);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews: ', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [slug]);

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div>
      <div className='flex items-center justify-center gap-48'>
        <div className='flex flex-col items-center'>
          <p className='text-gray-800 mb-1 text-xl font-semibold'>{reviews.length}</p>
          <div className="flex gap-1 align-middle">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        <p className='text-gray-800 text-center'>{reviews.length} reviews</p>
      </div>

      <div>
        <div className='flex justify-center mt-4'>
          <button
            className='bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors'
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Add review
          </button>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out ${showReviewForm ? 'max-h-screen' : 'max-h-0'
            } overflow-hidden`}
        >
          {showReviewForm && (
            <div className='flex justify-center mt-4 gap-4 items-center'>
              <textarea
                placeholder='Write a review'
                className="w-2/3 h-32 p-6 rounded-lg bg-white shadow focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-30 mb-2 transition-all"
              ></textarea>
              <button
                className='bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors h-10'
              >
                Submit
              </button>
            </div>
          )}
        </div>
        <hr className="my-4 border rounded-full"></hr>
      </div>

      <div className="mt-4 px-4">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <p>Seems like no one has said anything yet, be the first to let everyone know what you think!</p>
        )}
      </div>
    </div>
  );
};

export default ProductComments;
