'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc, setDoc, writeBatch, getDoc } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useSession } from 'next-auth/react';
import { useReview } from '@/context/ReviewContext';

const ProductComments = ({ slug }) => {
  const { data: session } = useSession();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateReview } = useReview();

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

  useEffect(() => {
    fetchReviews();
  }, [slug]);

  const handleAddReview = async (reviewData) => {
    const docRef = doc(db, 'Reviews', `${reviewData.author}-${reviewData.product_id}`);
    const productRef = doc(db, 'Products', reviewData.product_id);

    await setDoc(docRef, {
      ...reviewData,
      likedBy: [],
      likes: 0
    });

    const reviewsRef = collection(db, 'Reviews');
    const q = query(reviewsRef, where('product_id', '==', reviewData.product_id));
    const querySnapshot = await getDocs(q);

    let totalRating = 0;
    let reviewCount = 0;

    querySnapshot.forEach((doc) => {
      const review = doc.data();
      if (!isNaN(review.grade)) {
        totalRating += review.grade;
        reviewCount += 1;
      }
    });

    const newReviewValue = reviewCount > 0 ? totalRating / reviewCount : 0;

    await setDoc(productRef, {
      reviewCount: reviewCount,
      reviewValue: newReviewValue
    }, { merge: true });
    updateReview(reviewData.grade, reviews.length + 1);

    fetchReviews();
  };

  const handleDeleteReview = async (reviewId, product_id, reviewRating) => {

    const batch = writeBatch(db);

    try {
      const reviewRef = doc(db, 'Reviews', reviewId);
      batch.delete(reviewRef);

      const repliesRef = collection(db, 'Reviews', reviewId, 'replies');
      const repliesSnapshot = await getDocs(query(repliesRef));
      repliesSnapshot.forEach((replyDoc) => {
        batch.delete(doc(repliesRef, replyDoc.id));
      });

      const productRef = doc(db, 'Products', product_id);
      const productDoc = await getDoc(productRef);

      if (productDoc.exists()) {
        const productData = productDoc.data();
        const newReviewCount = (productData.reviewCount || 0) - 1;
        const newReviewValue = newReviewCount > 0 ? ((productData.reviewValue || 0) * (productData.reviewCount || 0) - reviewRating) / newReviewCount : 0;
        updateReview(newReviewValue, newReviewCount);

        batch.set(productRef, {
          reviewCount: newReviewCount,
          reviewValue: newReviewValue
        }, { merge: true });
      } else {
        console.error("Product does not exist");
      }

      await batch.commit();
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review and replies: ", error);
    }
  };

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  const reviewValue = reviews.reduce((acc, review) => acc + review.grade, 0) / reviews.length;

  return (
    <div>
      <div className='flex items-center justify-center gap-24 md:gap-48'>
        <div className='flex flex-col items-center'>
          <p className='text-gray-800 mb-1 text-xl font-semibold'>{reviewValue || ' '}</p>
          <div className="flex gap-1 align-middle">
            {[...Array(Math.floor(Math.max(0, Math.min(5, Number.isNaN(reviewValue) ? 0 : reviewValue))))].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            ))}
            {reviewValue % 1 !== 0 && (
              <div className="relative w-4 h-4 bg-gray-300 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-yellow-500" style={{ width: `${(reviewValue % 1) * 100}%` }}></div>
              </div>
            )}
            {[...Array(5 - Math.ceil(Math.max(0, Math.min(5, Number.isNaN(reviewValue) ? 0 : reviewValue))))].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-300 rounded-full"></div>
            ))}
          </div>
        </div>
        <p className='text-gray-800 text-center'>{reviews.length} reviews</p>
      </div>

      <div>
        <div className='flex justify-center mt-4'>
          {session ? (
            reviews.some(review => review.author === session.user.email) ? (
              <p className='text-center text-gray-700'>You have already written a review for this product</p>
            ) : (
              <button
                className='bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors'
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? 'Close review form' : 'Write a review'}
              </button>
            )) :
            <p className='text-center text-gray-700'>You must be logged in to write a review</p>}
        </div>
        <div className={`transition-all duration-500 ease-in-out ${showReviewForm ? 'max-h-screen' : 'max-h-0'} overflow-hidden`}>
          {showReviewForm && (
            <ReviewForm setShowReviewForm={setShowReviewForm} handleAddReview={handleAddReview}  />
          )}
        </div>
        <hr className="my-4 border rounded-full"></hr>
      </div>

      <div className="mt-4 px-4">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <ReviewCard key={review.id} review={review} handleDeleteReview={handleDeleteReview} product_id={slug}/>
          ))
        ) : (
          <p>Seems like no one has said anything yet, be the first to let everyone know what you think!</p>
        )}
      </div>
    </div>
  );
};

export default ProductComments;
