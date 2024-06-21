import ProductCard from "@/app/components/ProductCard"
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

async function fetchWishlistData(user_email) {
  const wishlistCollection = collection(db, 'Wishlists');
  const q = query(wishlistCollection, where('user_id', '==', user_email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


async function wishlistPage() {
  const session = await getServerSession(authOptions);
  const products = await fetchWishlistData(session.user.email)
  return (
    <div>
      <h1 className="text-4xl font-medium">Wishlist</h1>
      <div className="mt-6 flex flex-col gap-3 px-8 md:flex-row md:p-0 md:flex-wrap">
        {products.length > 0 ? products.map(product => (
          <ProductCard key={product.id} product={product} isFav={1}/>
        )) :
          <p className="text-gray-500 italic">*Wind&apos;s howling*</p>}
      </div>
    </div>
  )
}

export default wishlistPage