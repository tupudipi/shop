import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/firebaseInit";
import { getDocs, collection } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faDollarSign, faCalendarAlt, faMapMarkerAlt, faStar, faHeart, faCommentDots } from '@fortawesome/free-solid-svg-icons';

const getTotalOrders = async (userId) => {
  const ordersRef = collection(db, "Orders");
  const querySnapshot = await getDocs(ordersRef);
  const orders = querySnapshot.docs.filter((doc) => doc.data().userEmail === userId);
  return orders.length || 0;
};

const getTotalOrdersValue = async (userId) => {
  const ordersRef = collection(db, "Orders");
  const querySnapshot = await getDocs(ordersRef);
  const orders = querySnapshot.docs.filter((doc) => doc.data().userEmail === userId);
  const totalValue = orders.reduce((sum, order) => sum + order.data().total, 0);
  return totalValue || 0;
};

const getOrdersLastMonth = async (userId) => {
  const ordersRef = collection(db, "Orders");
  const querySnapshot = await getDocs(ordersRef);

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const orders = querySnapshot.docs.filter((doc) => {
    const data = doc.data();
    const createdAt = data.createdAt.toDate();
    return data.userEmail === userId && createdAt >= lastMonth && createdAt <= now;
  });

  return orders.length || 0;
};

const getFavoriteCategory = async (userId) => {
  const ordersRef = collection(db, "Orders");
  const querySnapshot = await getDocs(ordersRef);
  const orders = querySnapshot.docs.filter((doc) => doc.data().userEmail === userId);

  if (orders.length === 0) return "None";

  const categories = orders.reduce((acc, order) => {
    const data = order.data();
    data.products.forEach((product) => acc.push(product.category));
    return acc;
  }, []);

  const categoryCount = categories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const favoriteCategory = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b);

  return favoriteCategory || "None";
};

const getTotalAddresses = async (userId) => {
  const addressesRef = collection(db, "Addresses");
  const querySnapshot = await getDocs(addressesRef);
  const addresses = querySnapshot.docs.filter((doc) => doc.data().user_email === userId);
  return addresses.length || 0;
};

const getTotalReviews = async (userId) => {
  const reviewsRef = collection(db, "Reviews");
  const querySnapshot = await getDocs(reviewsRef);
  const reviews = querySnapshot.docs.filter((doc) => doc.data().author === userId);
  return reviews.length || 0;
};

const getAverageReviewGrade = async (userId) => {
  const reviewsRef = collection(db, "Reviews");
  const querySnapshot = await getDocs(reviewsRef);
  const reviews = querySnapshot.docs.filter((doc) => doc.data().author === userId);
  const totalGrade = reviews.reduce((sum, review) => sum + review.data().grade, 0);
  return reviews.length ? (totalGrade / reviews.length).toFixed(1) : "N/A";
};

export default async function accountPage() {
  const session = await getServerSession(authOptions);
  const totalOrders = await getTotalOrders(session.user.email);
  const totalOrdersValue = await getTotalOrdersValue(session.user.email);
  const totalAddresses = await getTotalAddresses(session.user.email);
  const ordersLastMonth = await getOrdersLastMonth(session.user.email);
  const totalReviews = await getTotalReviews(session.user.email);
  const averageReviewGrade = await getAverageReviewGrade(session.user.email);
  const favoriteCategory = await getFavoriteCategory(session.user.email);

  return (
    <div>
      <h1 className="text-4xl font-medium mb-6">Account Overview</h1>
      <p className="text-xl mb-8">Welcome back, {session.user.name.split(' ')[0]}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-medium mb-4">Order Summary</h2>
          <p className="flex items-center mb-2">
            <FontAwesomeIcon icon={faShoppingBag} className="mr-2" /> Total Orders: {totalOrders}
          </p>
          <p className="flex items-center mb-2">
            <FontAwesomeIcon icon={faDollarSign} className="mr-2" /> Total Order Value: ${totalOrdersValue}
          </p>
          <p className="flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> Orders Last Month: {ordersLastMonth}
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-medium mb-4">Address Information</h2>
          <p className="flex items-center mb-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> Total Addresses: {totalAddresses}
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-medium mb-4">Review Summary</h2>
          <p className="flex items-center mb-2">
            <FontAwesomeIcon icon={faCommentDots} className="mr-2" /> Total Reviews: {totalReviews}
          </p>
          <p className="flex items-center">
            <FontAwesomeIcon icon={faStar} className="mr-2" /> Average Review Grade: {averageReviewGrade}
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6 col-span-full lg:col-span-1">
          <h2 className="text-2xl font-medium mb-4">Favorite Category</h2>
          <p className="flex items-center">
            <FontAwesomeIcon icon={faHeart} className="mr-2" /> {favoriteCategory}
          </p>
        </div>
      </div>
    </div>
  );
}
