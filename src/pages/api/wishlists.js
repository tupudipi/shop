import { db } from "@/firebaseInit";
import { collection, getDocs } from "firebase/firestore";

export default function handler(req, res) {
    if (req.method === 'GET') {
        const getWishlists = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Wishlists"));
                const wishlists = [];
                querySnapshot.forEach((doc) => {
                    wishlists.push(doc.data());
                });
                return wishlists;
            } catch (e) {
                console.error("Error getting wishlists: ", e);
            }
        };

        getWishlists().then((wishlists) => res.status(200).json(wishlists));
    }
}
