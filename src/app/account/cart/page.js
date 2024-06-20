import ProductCard from "@/app/components/ProductCard"
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from "@/firebaseInit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

async function fetchCartData(user_email) {
    const cartCollection = collection(db, 'Carts');
    const q = query(cartCollection, where('user_id', '==', user_email));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


async function cartPage () {
  const session = await getServerSession(authOptions);
  const products = await fetchCartData(session.user.email)
  console.log(products)
  return (
    <div>
      <h1 className="text-4xl font-medium">Shopping cart</h1>
      <div className="mt-6 flex flex-col gap-3 px-8 md:flex-row md:p-0 md:flex-wrap">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default cartPage