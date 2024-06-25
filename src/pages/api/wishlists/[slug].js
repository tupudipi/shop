import { db } from "@/firebaseInit";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { slug } = req.query;
            const docRef = doc(db, "Wishlists", slug);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const wishlistData = docSnap.data();
                res.status(200).json(wishlistData);
            } else {
                console.error("No wishlist found with the given slug");
                res.status(404).json({ error: "Wishlist not found" });
            }
        } catch (e) {
            console.error("Error getting wishlist: ", e);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
