import { db } from "@/firebaseInit";
import { collection, getDocs } from "firebase/firestore";

export default function handler(req, res) {
    if (req.method === 'GET') {
        const getCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Categories"));
                const categories = [];
                querySnapshot.forEach((doc) => {
                    categories.push(doc.data());
                });
                return categories;
            } catch (e) {
                console.error("Error getting categories: ", e);
            }
        };

        getCategories().then((categories) => res.status(200).json(categories));
    }
}