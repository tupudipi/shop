
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const getTotalOrders = async (userId) => {
  return 5;
}

const getTotalAddresses = async (userId) => {
  return 3;
}

const getAddressesLastMonth = async (userId) => {
  return 1;
}

const getTotalProductsInWishlist = async (userId) => {
  return 2;
}

const getTotalReviews = async (userId) => {
  return 3;
}

const getAverageReviewGrade = async (userId) => {
  return 4.5;
}

const getFavoriteCategory = async (userId) => {
  return "Electronics";
}

const getTotalProductsInCart = async (userId) => {
  return 2;
}

const getCartValue = async (userId) => {
  return 1000;
}

export default async function accountPage() {
  const session = await getServerSession(authOptions);
  const totalOrders = await getTotalOrders(session.user.email);
  const totalAddresses = await getTotalAddresses(session.user.email);
  const addressesLastMonth = await getAddressesLastMonth(session.user.email);
  const totalProductsInWishlist = await getTotalProductsInWishlist(session.user.email);
  const totalReviews = await getTotalReviews(session.user.email);
  const averageReviewGrade = await getAverageReviewGrade(session.user.email);
  const favoriteCategory = await getFavoriteCategory(session.user.email);
  const totalProductsInCart = await getTotalProductsInCart(session.user.email);
  const cartValue = await getCartValue(session.user.email);

  return (
    <div>
      <h1 className="text-4xl font-semibold">Account Overview</h1>
      <div className="mt-6">
        <p>Hi, {session.user.name.split(' ')[0]}!</p>
        <p>Total Orders: {totalOrders}</p>
        <p>Total Addresses: {totalAddresses}</p>
        <p>Addresses Last Month: {addressesLastMonth}</p>
        <p>Total Products in Wishlist: {totalProductsInWishlist}</p>
        <p>Total Reviews: {totalReviews}</p>
        <p>Average Review Grade: {averageReviewGrade}</p>
        <p>Favorite Category: {favoriteCategory}</p>
        <p>Total Products in Cart: {totalProductsInCart}</p>
        <p>Cart Value: {cartValue}</p>
      </div>
    </div>
  );
}
