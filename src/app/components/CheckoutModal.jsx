'use client'
import { useState, useEffect, useRef } from 'react';
import { db } from "@/firebaseInit";
import { collection, query, where, getDocs } from "firebase/firestore";

function CheckoutModal({ isOpen, onClose, total, products, userEmail }) {
  const [addresses, setAddresses] = useState([]);
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Checkout submitted', { billingAddress, shippingAddress, paymentMethod, total });
    onClose();
  };

  if (!isOpen) return null;

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
              <option value="">Select Billing Address</option>
              {addresses.filter(addr => addr.billing).map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {`${addr.firstname} ${addr.surname}, ${addr.address}, ${addr.city}, ${addr.county}`}
                </option>
              ))}
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
              <option value="">Select Shipping Address</option>
              {addresses.filter(addr => addr.delivery).map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {`${addr.firstname} ${addr.surname}, ${addr.address}, ${addr.city}, ${addr.county}`}
                </option>
              ))}
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