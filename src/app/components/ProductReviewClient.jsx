'use client'
import { useReview } from "@/context/ReviewContext"

const ProductReviewClient = () => {
    const { reviewValue, reviewCount } = useReview()
    const localLastStarWidth = `${(reviewValue % 1) * 100}%`;

    return (
        <div className="flex gap-4 align-middle">
            <div className="flex gap-1">
                {[...Array(Math.floor(reviewValue || 0))].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                ))}
                {reviewValue % 1 !== 0 && (
                    <div className="relative w-4 h-4 bg-gray-300 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-yellow-500" style={{ width: localLastStarWidth }}></div>
                    </div>
                )}
                {[...Array(5 - Math.ceil(reviewValue || 0))].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-300 rounded-full"></div>
                ))}
            </div>
            <p className="text-sm">{reviewValue} <span className="text-gray-500">({reviewCount})</span></p>
        </div>
    )
}

export default ProductReviewClient