import { db } from "@/firebaseInit";
import { collection, getDocs } from "firebase/firestore";

export default function handler(req, res) {
    if (req.method === 'GET') {
        const getOrders = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Orders"));
                const orders = [];
                querySnapshot.forEach((doc) => {
                    orders.push(doc.data());
                });
                return orders;
            } catch (e) {
                console.error("Error getting orders: ", e);
            }
        };

        getOrders().then((orders) => res.status(200).json(orders));
    }
}