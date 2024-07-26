import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/firebaseInit";

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const ordersCollection = collection(db, 'Orders');
    const q = query(
      ordersCollection, 
      where('userEmail', '==', email)
    );
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}