import { db } from "@/firebaseInit";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

async function fetchUserData(collectionName, userEmail) {
  const q = query(collection(db, collectionName), where('user_id', '==', userEmail));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

async function mergeCollectionData(collectionName, userEmail, localData) {
  const userData = await fetchUserData(collectionName, userEmail);
  
  // Merge local data with user data
  const mergedData = [...userData];
  localData.forEach(item => {
    if (!mergedData.some(i => i.slug === item.slug)) {
      mergedData.push({ ...item, user_id: userEmail });
    }
  });

  // Update Firestore
  const collectionRef = collection(db, collectionName);
  const deletePromises = userData.map(item => deleteDoc(doc(db, collectionName, item.id)));
  const addPromises = mergedData.map(item => addDoc(collectionRef, item));

  await Promise.all([...deletePromises, ...addPromises]);

  return mergedData;
}

export async function mergeWishlistAndCart(userEmail) {
    console.log('Starting merge process for user:', userEmail);
    
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    console.log('Local wishlist:', localWishlist);
    console.log('Local cart:', localCart);
  
    try {
      // Merge wishlist
      console.log('Merging wishlist...');
      await mergeCollectionData('Wishlists', userEmail, localWishlist);
      
      // Merge cart
      console.log('Merging cart...');
      await mergeCollectionData('Carts', userEmail, localCart);
      
      // Clear local storage
      console.log('Clearing local storage...');
      localStorage.removeItem('wishlist');
      localStorage.removeItem('cart');
      
      console.log('Merge process completed successfully');
    } catch (error) {
      console.error('Error during merge process:', error);
    }
  }