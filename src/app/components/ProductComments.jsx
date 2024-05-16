'use client'

import { useState } from "react"
import ReviewCard from "./ReviewCard";

const ProductComments = () => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <>
      <div>
        <div className='flex items-center justify-center gap-48'>
          <div className='flex flex-col items-center'>
            <p className='text-gray-800 mb-1 text-xl font-semibold'>4</p>
            <div className="flex gap-1 align-middle">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <p className='text-gray-800 text-center'>12 reviews</p>
        </div>

        <div>
          <div className='flex justify-center mt-4'>
            {/* Toggle the visibility state when the button is clicked */}
            <button
              className='bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors'
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              Add review
            </button>
          </div>
          {/* Smooth transition for the review form */}
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
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
        </div>
      </div>
    </>
  )
}

export default ProductComments