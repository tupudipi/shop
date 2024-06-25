import { db } from "@/firebaseInit";
import { collection, query, where, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { categoryID } = req.query;

            let q;
            if (categoryID) {
                q = query(collection(db, "Products"), where("category_id", "==", Number(categoryID)));
            } else {
                q = query(collection(db, "Products"));
            }

            const querySnapshot = await getDocs(q);
            const products = [];
            querySnapshot.forEach((doc) => {
                products.push({ id: doc.id, ...doc.data() });
            });

            res.status(200).json(products);
        } catch (e) {
            console.error("Error getting products: ", e);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
