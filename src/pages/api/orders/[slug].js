import { db } from "@/firebaseInit";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { slug } = req.query;
            const docRef = doc(db, "Orders", slug);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const orderData = docSnap.data();
                res.status(200).json(orderData);
            } else {
                console.error("No order found with the given slug");
                res.status(404).json({ error: "Order not found" });
            }
        } catch (e) {
            console.error("Error getting order: ", e);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
