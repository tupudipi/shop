'use client'
import { CartContext } from "@/context/CartContext";
import { useContext } from "react";

const ProductCardQuantityClientElement = ({ product }) => {
    const { cart, incrementCartItem, decrementCartItem, removeFromCart } = useContext(CartContext);
    const existingProduct = cart.find(item => item.slug === product.slug);
    const quantity = existingProduct ? existingProduct.quantity : 0;
    const isMaxQuantity = quantity >= product.stock;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-1">
                <button 
                    className={`bg-blue-500 text-white px-4 py-1 rounded-lg transition-colors ${quantity > 0 ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'}`} 
                    onClick={() => decrementCartItem(product.slug)}
                    disabled={quantity === 0}
                >
                    -
                </button>
                <span className="border-gray-600 py-1 px-4 border bg-white">{quantity}</span>
                <button 
                    className={`bg-blue-500 text-white px-4 py-1 rounded-lg transition-colors ${!isMaxQuantity ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'}`} 
                    onClick={() => incrementCartItem(product.slug)}
                    disabled={isMaxQuantity}
                >
                    +
                </button>
            </div>
            {isMaxQuantity && (
                <p className="text-sm text-red-500">Max quantity reached</p>
            )}
            <div>
                <p className="font-bold text-start">Subtotal: ${(product.price * quantity).toFixed(2)}</p>
            </div>
            <div>
                <button 
                    className="text-red-500 hover:text-red-600 hover:underline transition-all" 
                    onClick={() => removeFromCart(product.slug)}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default ProductCardQuantityClientElement