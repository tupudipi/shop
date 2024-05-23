import { db } from "@/firebaseInit";  // Adjust the path to your firebaseInit
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

async function seedProducts() {
  const products = [
    { category_id: 1, price: 25.99, name: "Basic T-Shirt", stock: 50, description: "A basic t-shirt made from 100% cotton.", slug: "basic-t-shirt" },
    { category_id: 1, price: 29.99, name: "Graphic T-Shirt", stock: 40, description: "A stylish t-shirt with a cool graphic print.", slug: "graphic-t-shirt" },
    { category_id: 2, price: 49.99, name: "Pullover Hoodie", stock: 20, description: "A cozy pullover hoodie perfect for chilly weather.", slug: "pullover-hoodie" },
    { category_id: 2, price: 59.99, name: "Zipper Hoodie", stock: 15, description: "A warm hoodie with a convenient front zipper.", slug: "zipper-hoodie" },
    { category_id: 3, price: 79.99, name: "Windbreaker Jacket", stock: 25, description: "A lightweight windbreaker jacket for windy days.", slug: "windbreaker-jacket" },
    { category_id: 3, price: 99.99, name: "Leather Jacket", stock: 10, description: "A stylish leather jacket for a bold look.", slug: "leather-jacket" },
    { category_id: 4, price: 34.99, name: "Canvas Tote Bag", stock: 60, description: "A durable canvas tote bag for everyday use.", slug: "canvas-tote-bag" },
    { category_id: 4, price: 45.99, name: "Leather Messenger Bag", stock: 30, description: "A premium leather messenger bag for professionals.", slug: "leather-messenger-bag" },
    { category_id: 5, price: 2.99, name: "Sticker Pack", stock: 100, description: "A pack of fun and colorful stickers.", slug: "sticker-pack" },
    { category_id: 5, price: 1.99, name: "Single Sticker", stock: 150, description: "A single sticker with a unique design.", slug: "single-sticker" },
    { category_id: 6, price: 10.99, name: "Keychain", stock: 70, description: "A stylish keychain for your keys.", slug: "keychain" },
    { category_id: 6, price: 15.99, name: "Coffee Mug", stock: 40, description: "A ceramic coffee mug with a unique design.", slug: "coffee-mug" }
  ];

  const productsCollection = collection(db, "Products");

  for (const product of products) {
    const docRef = doc(productsCollection, product.slug);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, product);
    } else {
      console.log(`Product with slug ${product.slug} already exists`);
    }
  }

  console.log("Products seeded successfully");
}

seedProducts().catch(console.error);
