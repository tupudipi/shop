'use client'
import { CartContext } from "@/context/CartContext";
import { useContext } from "react";

const ProductCardQuantityClientElement = ({ product }) => {
    const { cart, incrementCartItem, decrementCartItem, removeFromCart } = useContext(CartContext);

    const existingProduct = cart.find(item => item.slug === product.slug);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-1">
                <button className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => decrementCartItem(product.slug)}>-</button>
                <span className="border-gray-600 py-1 px-4 border bg-white">{existingProduct ? existingProduct.quantity : 0}</span>
                <button className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => incrementCartItem(product.slug)}>+</button>
            </div>
            <div>
                <p className="font-bold text-start">${(product.price * (existingProduct ? existingProduct.quantity : 0)).toFixed(2)}</p>
            </div>
            <div>
                <button className="text-red-500 hover:text-red-600 hover:underline transition-all" onClick={() => removeFromCart(product.slug)}>Delete</button>
            </div>
        </div>

    )
}

export default ProductCardQuantityClientElement