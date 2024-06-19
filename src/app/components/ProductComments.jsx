'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useSession } from 'next-auth/react';

const ProductComments = ({ slug }) => {
  const { data: session } = useSession();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const reviewValue = reviews.reduce((acc, review) => acc + review.grade, 0) / reviews.length;

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
      <div className='flex items-center justify-center gap-24 md:gap-48'>
        <div className='flex flex-col items-center'>
          <p className='text-gray-800 mb-1 text-xl font-semibold'>{reviewValue}</p>
          <div className="flex gap-1 align-middle">
            {[...Array(Math.floor(reviewValue))].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            ))}
            {reviewValue % 1 !== 0 && (
              <div className="relative w-4 h-4 bg-gray-300 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-yellow-500" style={{ width: `${(reviewValue % 1) * 100}%` }}></div>
              </div>
            )}
            {[...Array(5 - Math.ceil(reviewValue))].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-300 rounded-full"></div>
            ))}
          </div>
        </div>
        <p className='text-gray-800 text-center'>{reviews.length} reviews</p>
      </div>

      <div>
        <div className='flex justify-center mt-4'>
          {session ? (
            <button
              className='bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors'
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Close review form' : 'Write a review'}
            </button>
          ) : 
            <p className='text-center text-gray-700'>You must be logged in to write a review</p>}
        </div>
        <div
          className={`transition-all duration-500 ease-in-out ${showReviewForm ? 'max-h-screen' : 'max-h-0'
            } overflow-hidden`}
        >
          {showReviewForm && (
            <ReviewForm setShowReviewForm={setShowReviewForm} />
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
