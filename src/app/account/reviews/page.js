import Link from "next/link"

const reviewsPage = () => {
  const reviews = [
    {
      id: 1,
      product: "Product 1",
      date: "2022-01-01",
      productId: "product-1",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      id: 2,
      product: "Product 2",
      date: "2022-01-02",
      productId: "product-2",
      content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    // Add more review objects as needed
  ];

  return (
    <div>
      <h1 className="text-4xl font-medium">My Reviews</h1>
      <div className="mt-6 flex items-center gap-2 md:gap-4 flex-wrap">
      </div>
      <ul className="mt-6 space-y-4 md:w-2/3">
        {reviews.map((review) => (
          <li key={review.id} className="border border-gray-200 rounded-lg bg-white shadow-sm p-4">
            <div className="flex gap-2">
              <Link href={`/products/${review.productId}`}>
                <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
              </Link>
              <div>
                <Link href={`/products/${review.productId}`}>
                  <h2 className="text-lg font-medium hover:underline">{review.product}</h2>
                </Link>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>

            <p className="mt-2 text-gray-700 line-clamp-3">{review.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default reviewsPage