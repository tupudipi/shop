import { db } from "@/firebaseInit";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { slug } = req.query;
            const docRef = doc(db, "Users", slug);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                res.status(200).json(userData);
            } else {
                console.error("No user found with the given slug");
                res.status(404).json({ error: "User not found" });
            }
        } catch (e) {
            console.error("Error getting user: ", e);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
