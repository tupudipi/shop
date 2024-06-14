import { useState } from 'react';

const ReviewForm = ({setShowReviewForm}) => {
    const [rating, setRating] = useState(0);

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        console.log(`Rating: ${rating}`);
        console.log(`Review: ${event.target[0].value}`);
        console.log(`Date: ${new Date().toLocaleDateString()}`);
        console.log(`User: nimic momentan`)
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
                            className={`w-4 h-4 rounded-full cursor-pointer ${i < rating ? 'bg-yellow-500' : 'bg-gray-300'
                                }`}
                            onClick={() => handleRatingChange(i + 1)}
                        ></div>
                    ))}
                </div>
            </div>
            <form onSubmit={handleFormSubmit}>
                <div className='flex justify-center gap-4 items-center'>
                    <textarea
                        placeholder='Write a review'
                        className="w-2/3 h-32 p-6 rounded-lg bg-white shadow focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-30 mb-2 transition-all"
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
