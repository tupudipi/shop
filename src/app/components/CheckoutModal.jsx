'use client'
import { useState, useEffect, useRef } from 'react';
import { db } from "@/firebaseInit";
import { collection, serverTimestamp, query, where, getDocs, writeBatch, doc, getDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import Toast from '@/app/components/Toast';

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
  const [billingAddressId, setBillingAddressId] = useState('');
  const [shippingAddressId, setShippingAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const modalRef = useRef();
  const [toastConfig, setToastConfig] = useState({ show: false, message: '', isLoading: false });

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

      if (defaultBilling) setBillingAddressId(defaultBilling.id);
      if (defaultShipping) setShippingAddressId(defaultShipping.id);
    };

    if (isOpen) {
      fetchAddresses();
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
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

  const fetchAddressById = async (id) => {
    const addressDoc = await getDoc(doc(db, "Addresses", id));
    return addressDoc.exists() ? addressDoc.data() : null;
  };

  const fetchCategoryById = async (id) => {
    try {
      const categoryDoc = await getDoc(doc(db, "Categories", String(id)));
      if (categoryDoc.exists()) {
        return categoryDoc.data().category_name;
      } else {
        throw new Error(`Category not found for id: ${id}`);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      return 'Unknown Category';
    }
  };
  

  const removeFields = (address) => {
    const { isMainBilling, isMainDelivery, ...filteredAddress } = address;
    return filteredAddress;
  };

  const fetchSelectedAddresses = async () => {
    const billing = await fetchAddressById(billingAddressId);
    const shipping = await fetchAddressById(shippingAddressId);
    return {
      billing: removeFields(billing),
      shipping: removeFields(shipping)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastConfig({ show: true, message: 'Processing order...', isLoading: true });
  
    try {
      const { billing, shipping } = await fetchSelectedAddresses();
  
      const truncatedProducts = await Promise.all(products.map(async product => {
        const categoryName = await fetchCategoryById(product.category_id);
        return {
          name: product.name,
          quantity: product.quantity,
          pricePerPiece: product.price,
          totalPerProduct: product.price * product.quantity,
          slug: product.slug,
          image: product.image,
          category: categoryName
        };
      }));
  
      const orderNumber = generateOrderNumber();
      const currentTimestamp = new Date();
  
      const orderData = {
        orderNumber,
        billingAddress: billing,
        shippingAddress: shipping,
        paymentMethod,
        total,
        userEmail,
        products: truncatedProducts,
        createdAt: serverTimestamp(),
        status: 'pending',
        statusHistory: [
          {
            status: 'pending',
            timestamp: currentTimestamp.toISOString(),
            note: 'Order placed'
          }
        ]
      };
  
      const batch = writeBatch(db);
  
      const orderRef = doc(collection(db, "Orders"));
      batch.set(orderRef, orderData);
  
      for (const product of truncatedProducts) {
        const productRef = doc(db, "Products", product.slug);
        const productDoc = await getDoc(productRef);
  
        if (productDoc.exists()) {
          const currentStock = productDoc.data().stock;
          const newStock = currentStock - product.quantity;
  
          if (newStock >= 0) {
            batch.update(productRef, { stock: newStock });
          } else {
            throw new Error(`Insufficient stock for product: ${product.name}`);
          }
        } else {
          throw new Error(`Product not found: ${product.name}`);
        }
      }
  
      await batch.commit();
  
      await clearUserCart(userEmail);
      setToastConfig({ show: true, message: 'Order placed successfully!', isLoading: false });
  
      setTimeout(() => {
        setToastConfig({ show: false, message: '', isLoading: false });
        onClose();
        router.push('/account/orders');
      }, 2000);
  
    } catch (error) {
      console.error("Error processing order: ", error);
      setToastConfig({ show: true, message: 'Error placing order. Please try again.', isLoading: false });
      setTimeout(() => {
        setToastConfig({ show: false, message: '', isLoading: false });
      }, 2000);
    }
  };
  
  

  const clearUserCart = async (userEmail) => {
    const cartQuery = query(collection(db, "Carts"), where("user_id", "==", userEmail));
    const querySnapshot = await getDocs(cartQuery);

    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <div ref={modalRef} className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-4 border-b">
          <h2 className="text-2xl font-bold">Checkout</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
            {products.map((product) => (
              <div key={product.slug} className="flex justify-between items-center mb-2">
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
              value={billingAddressId}
              onChange={(e) => setBillingAddressId(e.target.value)}
              required
            >
              {renderAddressOptions(false)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Shipping Address</label>
            <select
              className="w-full p-2 border rounded"
              value={shippingAddressId}
              onChange={(e) => setShippingAddressId(e.target.value)}
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={toastConfig.isLoading || toastConfig.show}
            >
              {toastConfig.isLoading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
      {toastConfig.show && (
        <Toast
          message={toastConfig.message}
          isLoading={toastConfig.isLoading}
          duration={2000}
        />
      )}
    </div>
  );
}

export default CheckoutModal;