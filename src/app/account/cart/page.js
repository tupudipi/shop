'use client';

import { useState, useContext } from 'react';
import { CartContext } from "@/context/CartContext";
import ProductCard from "@/app/components/ProductCard";
import CheckoutModal from "@/app/components/CheckoutModal";
import { useSession } from 'next-auth/react';

function CartPage() {
  const { cart } = useContext(CartContext);
  const { data: session } = useSession();
  const products = cart;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckoutClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-4xl font-medium">Shopping Cart</h1>
      {
        products.length > 0 ? (
          <>
            <div className='mt-6 flex flex-col gap-2'>
              <p className="text-lg font-bold">Total: ${products.reduce((acc, product) => acc + product.price * product.quantity, 0).toFixed(2)}</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleCheckoutClick}
              >
                Checkout
              </button>
              <hr className="w-full my-6 border-gray-300 border-2 rounded-full shadow-md" />
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-8 md:p-0">
              {products.map(product => (
                <ProductCard key={product.id} product={product} isCart={true} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-6 flex flex-col gap-3 px-8 md:flex-row md:p-0 md:flex-wrap">
            <p className="text-gray-500 italic">*Tumbleweeds rustling*</p>
          </div>
        )
      }
      {isModalOpen && (
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          total={products.reduce((acc, product) => acc + product.price * product.quantity, 0)}
          products={products}
          userEmail={session?.user?.email}
        />
      )}
    </div>
  );
}

export default CartPage;
