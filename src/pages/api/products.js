import { db } from "@/firebaseInit";
import { collection, getDocs } from "firebase/firestore";

export default function handler(req, res) {
    if (req.method === 'GET') {
        const getProducts = async () => {
            try {
                // const { slug } = req.query
                const querySnapshot = await getDocs(collection(db, "Products"));
                const products = [];
                querySnapshot.forEach((doc) => {
                    products.push(doc.data());
                });
                return products;
            } catch (e) {
                console.error("Error getting products: ", e);
            }
        };

        getProducts().then((products) => res.status(200).json(products));
    }
}
