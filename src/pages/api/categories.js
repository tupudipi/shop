import { db } from "@/firebaseInit";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { category_name } = req.query;
      if (category_name) {
        const q = query(collection(db, "Categories"), where("category_name", "==", category_name));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          res.status(200).json({ id: querySnapshot.docs[0].id });
        } else {
          console.error("No category found with the given name");
          res.status(404).json({ error: "Category not found" });
        }
      } else {
        const querySnapshot = await getDocs(collection(db, "Categories"));
        const categories = [];
        querySnapshot.forEach((doc) => {
          categories.push(doc.data());
        });
        res.status(200).json(categories);
      }
    } catch (e) {
      console.error("Error getting categories: ", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
