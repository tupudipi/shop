import { db } from "@/firebaseInit";
import { collection, getDocs } from "firebase/firestore";

export default function handler(req, res) {
    if (req.method === 'GET') {
        const getUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Users"));
                const users = [];
                querySnapshot.forEach((doc) => {
                    users.push(doc.data());
                });
                return users;
            } catch (e) {
                console.error("Error getting users: ", e);
            }
        };

        getUsers().then((users) => res.status(200).json(users));
    }
}
