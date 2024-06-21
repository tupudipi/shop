import Link from "next/link";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Image from "next/image";

const fetchReviewsData = async (user_email) => {
  const reviewsCollection = collection(db, 'Reviews');
  const q = query(reviewsCollection, where('author', '==', user_email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const fetchProductData = async (product_id) => {
  const productCollection = collection(db, 'Products');
  const q = query(productCollection, where('slug', '==', product_id));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const productDoc = querySnapshot.docs[0];
    return { id: productDoc.id, ...productDoc.data() };
  }
  return null;
}

async function reviewsPage() {
  const session = await getServerSession(authOptions);

  const reviews = await fetchReviewsData(session.user.email);

  const reviewsWithProductData = await Promise.all(reviews.map(async (review) => {
    const productData = await fetchProductData(review.product_id);
    return { ...review, product: productData };
  }));

  return (
    <div>
      <h1 className="text-4xl font-medium">My Reviews</h1>
        {reviewsWithProductData.length > 0 ?
          (<ul className="mt-6 flex flex-col md:flex-row items-stretch gap-2 md:gap-4 flex-wrap">
            {reviewsWithProductData.map((review) => (
              <li key={review.id} className="border border-gray-200 rounded-lg bg-white shadow-sm p-4">
                <div className="flex gap-2">
                  <Link href={`/products/${review.product_id}`}>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg">
                      <Image width={96} height={96} src={review.product?.image} alt={review.product?.name} className="object-cover w-full h-full rounded-lg" />
                    </div>
                  </Link>
                  <div className="space-y-2">
                    <Link href={`/products/${review.product_id}`}>
                      <h2 className="text-lg font-medium hover:underline">{review.product?.name}</h2>
                    </Link>
                    <p className="text-sm text-gray-500">{review.date}</p>
                    <div className="flex gap-1">
                      {[...Array(Math.floor(review.grade))].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      ))}
                      {review.grade % 1 !== 0 && (
                        <div className="relative w-4 h-4 bg-gray-300 rounded-full overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-yellow-500" style={{ width: `${(review.grade % 1) * 100}%` }}></div>
                        </div>
                      )}
                      {[...Array(5 - Math.ceil(review.grade))].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-gray-700 line-clamp-3 italic">&quot;{review.content}&quot;</p>
              </li>
            ))}
          </ul>) :
          <p className="text-gray-500 italic">*Crickets chirping*</p>}
      </div>
  );
}

export default reviewsPage;
