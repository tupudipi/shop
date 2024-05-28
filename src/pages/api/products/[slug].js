// /api/products/[slug].js

import { db } from "@/firebaseInit";  // Ensure the path to your firebaseInit is correct
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { slug } = req.query;
            const docRef = doc(db, "Products", slug);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const productData = docSnap.data();
                res.status(200).json(productData);
            } else {
                console.error("No product found with the given slug");
                res.status(404).json({ error: "Product not found" });
            }
        } catch (e) {
            console.error("Error getting product: ", e);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
