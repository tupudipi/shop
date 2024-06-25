import { db } from "@/firebaseInit";
import { collection, getDocs } from "firebase/firestore";

export default function handler(req, res) {
    if (req.method === 'GET') {
        const getCarts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Carts"));
                const carts = [];
                querySnapshot.forEach((doc) => {
                    carts.push(doc.data());
                });
                return carts;
            } catch (e) {
                console.error("Error getting carts: ", e);
            }
        };

        getCarts().then((carts) => res.status(200).json(carts));
    }
}
