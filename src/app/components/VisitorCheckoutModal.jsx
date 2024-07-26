import { useState, useEffect, useRef, useContext } from 'react';
import { db } from "@/firebaseInit";
import { addDoc, collection, serverTimestamp, getDoc, doc, writeBatch } from "firebase/firestore";
import { CartContext } from "@/context/CartContext";
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

function VisitorCheckoutModal({ isOpen, onClose, total, products }) {
  const { clearCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    shippingAddress: '',
    shippingCity: '',
    shippingCounty: '',
    billingAddress: '',
    billingCity: '',
    billingCounty: '',
    paymentMethod: 'cash',
  });
  const [useShippingForBilling, setUseShippingForBilling] = useState(false);
  const [toastConfig, setToastConfig] = useState({ show: false, message: '', isLoading: false });
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastConfig({ show: true, message: 'Processing order...', isLoading: true });

    const truncatedProducts = products.map(product => ({
      name: product.name,
      quantity: product.quantity,
      pricePerPiece: product.price,
      totalPerProduct: product.price * product.quantity,
      slug: product.slug,
      image: product.image
    }));

    const orderNumber = generateOrderNumber();
    const currentTimestamp = new Date();

    try {
      const orderData = {
        orderNumber,
        billingAddress: useShippingForBilling ? formData.shippingAddress : formData.billingAddress,
        billingCity: useShippingForBilling ? formData.shippingCity : formData.billingCity,
        billingCounty: useShippingForBilling ? formData.shippingCounty : formData.billingCounty,
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingCounty: formData.shippingCounty,
        paymentMethod: formData.paymentMethod,
        total,
        userEmail: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
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

      console.log("Order data:", orderData);

      // Batch write for order creation and stock update
      const batch = writeBatch(db);

      // Add the order to the batch
      const orderRef = doc(collection(db, "Orders"));
      batch.set(orderRef, orderData);

      // Update stock for each product in the batch
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

      // Commit the batch
      await batch.commit();

      console.log("Order data:", orderData);
      clearCart();
      setToastConfig({ show: true, message: 'Order placed successfully!', isLoading: false });
      setTimeout(() => {
        setToastConfig({ show: false, message: '', isLoading: false });
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error processing order: ", error);
      setToastConfig({ show: true, message: 'Error placing order. Please try again.', isLoading: false });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto p-4">
      <div ref={modalRef} className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-4 border-b">
          <h2 className="text-2xl font-bold">Checkout</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
              <div className="bg-gray-100 p-2 rounded">
                {products.map((product) => (
                  <div key={product.slug} className="flex justify-between items-center mb-1">
                    <span>{product.name} x {product.quantity}</span>
                    <span>${(product.price * product.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="font-bold mt-2 text-right">Total: ${total.toFixed(2)}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <input type="text" name="firstName" placeholder="First Name" onChange={handleInputChange} required className="w-full p-2 border rounded mb-2" />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} required className="w-full p-2 border rounded mb-2" />
              <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required className="w-full p-2 border rounded mb-2" />
              <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleInputChange} required className="w-full p-2 border rounded mb-2" />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
              <textarea name="shippingAddress" placeholder="Address" onChange={handleInputChange} required className="w-full p-2 border rounded mb-2 h-24"></textarea>
              <input type="text" name="shippingCity" placeholder="City" onChange={handleInputChange} required className="w-full p-2 border rounded mb-2" />
              <input type="text" name="shippingCounty" placeholder="County" onChange={handleInputChange} required className="w-full p-2 border rounded mb-2" />
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">Billing Address</h3>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={useShippingForBilling}
                  onChange={() => setUseShippingForBilling(!useShippingForBilling)}
                  className="mr-2"
                />
                Use shipping address for billing
              </label>
              {!useShippingForBilling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <textarea name="billingAddress" placeholder="Address" onChange={handleInputChange} required className="w-full p-2 border rounded mb-2 h-24"></textarea>
                  <div>
                    <input type="text" name="billingCity" placeholder="City" onChange={handleInputChange} required className="w-full p-2 border rounded mb-2" />
                    <input type="text" name="billingCounty" placeholder="County" onChange={handleInputChange} required className="w-full p-2 border rounded mb-2" />
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="credit">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="cash">Cash on delivery</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
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

export default VisitorCheckoutModal;