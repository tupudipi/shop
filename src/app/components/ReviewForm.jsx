'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

const ReviewForm = ({ setShowReviewForm, handleAddReview }) => {
    const { data: session } = useSession();
    const [rating, setRating] = useState(0);

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const product_id = window.location.pathname.split('/').pop();

        const reviewData = {
            author: session.user.email,
            content: event.target[0].value,
            date: new Date().toLocaleDateString(),
            grade: rating,
            likes: 0,
            product_id: product_id
        };

        await handleAddReview(reviewData);
        setShowReviewForm(false);
    };

    return (
        <div className='flex flex-col mt-6 gap-4'>
            <div>
                <p className='text-lg text-center mb-1'>Your experience with this product: </p>
                <div className="flex gap-1 justify-center">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-4 h-4 rounded-full cursor-pointer ${i < rating ? 'bg-yellow-500' : 'bg-gray-300'}`}
                            onClick={() => handleRatingChange(i + 1)}
                        ></div>
                    ))}
                </div>
            </div>
            <form onSubmit={handleFormSubmit}>
                <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 items-center'>
                    <textarea
                        placeholder='Share your thoughts'
                        className="w-full md:w-2/3 h-32 p-6 rounded-lg bg-white shadow focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-30 mb-2 transition-all"
                    ></textarea>
                    <button
                        type="submit"
                        className='bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors h-10'
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
