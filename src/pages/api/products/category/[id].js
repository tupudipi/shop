
import { db } from "@/firebaseInit";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "Category ID is required" });
      }

      const q = query(
        collection(db, "Products"), 
        where("category_id", "==", +id),
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(products);
      } else {
        console.error("No products found for the given category ID");
        res.status(404).json({ error: "Products not found" });
      }
    } catch (e) {
      console.error("Error getting products: ", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
