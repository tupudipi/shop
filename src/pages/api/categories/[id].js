import { db } from "@/firebaseInit";  // Ensure the path to your firebaseInit is correct
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { id } = req.query;
            const docRef = doc(db, "Categories", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const categoryData = docSnap.data();
                res.status(200).json(categoryData);
            } else {
                console.error("No category found with the given id");
                res.status(404).json({ error: "Category not found" });
            }
        } catch (e) {
            console.error("Error getting category: ", e);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
