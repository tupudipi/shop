import { db } from "@/firebaseInit";
import { collection, query, getDocs, where } from "firebase/firestore";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { categoryId } = req.query;

            // Fetch products, filtered by category if provided
            let productsQuery;
            if (categoryId) {
                productsQuery = query(collection(db, "Products"), where("category_id", "==", Number(categoryId)));
            } else {
                productsQuery = query(collection(db, "Products"));
            }
            const productsSnapshot = await getDocs(productsQuery);

            // Fetch all reviews
            const reviewsQuery = query(collection(db, "Reviews"));
            const reviewsSnapshot = await getDocs(reviewsQuery);

            // Count reviews for each product
            const reviewCounts = {};
            reviewsSnapshot.forEach((doc) => {
                const productId = doc.data().product_id;
                reviewCounts[productId] = (reviewCounts[productId] || 0) + 1;
            });

            // Combine product data with review counts
            const products = [];
            productsSnapshot.forEach((doc) => {
                const productData = doc.data();
                products.push({
                    id: doc.id,
                    ...productData,
                    reviewCount: reviewCounts[doc.id] || 0
                });
            });

            res.status(200).json(products);
        } catch (e) {
            console.error("Error getting products with review count: ", e);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}