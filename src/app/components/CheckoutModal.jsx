'use client'
import { useState, useEffect, useRef } from 'react';
import { db } from "@/firebaseInit";
import { addDoc, collection, serverTimestamp, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { revalidatePath } from 'next/cache';

function generateOrderNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

  return `${year}${month}${day}-${hours}${minutes}${seconds}-${randomSuffix}`;
}

function CheckoutModal({ isOpen, onClose, total, products, userEmail }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const modalRef = useRef();

  useEffect(() => {
    const fetchAddresses = async () => {
      const addressesQuery = query(collection(db, "Addresses"), where("user_email", "==", userEmail));
      const querySnapshot = await getDocs(addressesQuery);
      const fetchedAddresses = [];
      querySnapshot.forEach((doc) => {
        fetchedAddresses.push({ id: doc.id, ...doc.data() });
      });
      setAddresses(fetchedAddresses);

      const defaultBilling = fetchedAddresses.find(addr => addr.isMainBilling);
      const defaultShipping = fetchedAddresses.find(addr => addr.isMainDelivery);

      if (defaultBilling) setBillingAddress(defaultBilling.id);
      if (defaultShipping) setShippingAddress(defaultShipping.id);
    };

    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen, userEmail]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const truncatedProducts = products.map(product => ({
      name: product.name,
      quantity: product.quantity,
      pricePerPiece: product.price,
      totalPerProduct: product.price * product.quantity,
      slug: product.slug
    }));

    const orderNumber = generateOrderNumber();

    try {
      const orderData = {
        orderNumber,
        billingAddress,
        shippingAddress,
        paymentMethod,
        total,
        userEmail,
        products: truncatedProducts,
        createdAt: serverTimestamp(),
        status: 'pending'
      };

      const docRef = await addDoc(collection(db, "Orders"), orderData);

      await clearUserCart(userEmail);
      onClose();

      router.push('/account/orders');
    } catch (error) {
      console.error("Error processing order: ", error);
    }
  };

  const clearUserCart = async (userEmail) => {
    const cartQuery = query(collection(db, "Carts"), where("user_id", "==", userEmail));
    const querySnapshot = await getDocs(cartQuery);

    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  };

  if (!isOpen) return null;

  const renderAddressOptions = (isShipping) => {
    const mainAddress = addresses.find(addr =>
      isShipping ? addr.isMainDelivery : addr.isMainBilling
    );

    return (
      <>
        {addresses.map((addr) => (
          <option key={addr.id} value={addr.id}>
            {`${addr.firstname} ${addr.surname}, ${addr.address}, ${addr.city}, ${addr.county}, ${addr.phone}${addr.id === mainAddress?.id ? ' (Main)' : ''}`}
          </option>
        ))}
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center mb-2">
                <span>{product.name} x {product.quantity}</span>
                <span>${(product.price * product.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="font-bold mt-2">Total: ${total.toFixed(2)}</div>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Billing Address</label>
            <select
              className="w-full p-2 border rounded"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              required
            >
              {renderAddressOptions(false)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Shipping Address</label>
            <select
              className="w-full p-2 border rounded"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            >
              {renderAddressOptions(true)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Payment Method</label>
            <select
              className="w-full p-2 border rounded"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="credit">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cash">Cash on delivery</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutModal;
