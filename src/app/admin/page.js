import SalesChart from "./components/SalesChart";
import PopularCategoriesChart from "./components/PopularCategoriesChart";
import ProductsList from "./components/ProductsList";
import LowStockAlert from "./components/LowStockAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faShoppingCart, faStar, faUsers } from "@fortawesome/free-solid-svg-icons";
import { db } from "@/firebaseInit";
import { collection, getDocs } from "firebase/firestore";

//count documents in users, products, orders, and reviews collections
const getStats = async () => {
  const stats = [
    { title: "Users", collection: "Users", icon: faUsers, color: "border-blue-500" },
    { title: "Products", collection: "Products", icon: faBoxOpen, color: "border-green-500"  },
    { title: "Orders", collection: "Orders", icon: faShoppingCart, color: "border-yellow-500" },
    { title: "Reviews", collection: "Reviews", icon: faStar, color: "border-purple-500" },
  ];

  const statsWithCount = await Promise.all(stats.map(async stat => {
    const collectionRef = collection(db, stat.collection);
    const snapshot = await getDocs(collectionRef);
    return { ...stat, count: snapshot.size };
  }));

  return statsWithCount;
}


const StatCard = ({ title, count, icon, color }) => (
  <div className={`bg-white rounded-lg shadow-lg p-6 flex items-center border-l-4 ${color}`}>
    <div className="mr-4 text-3xl">
      <FontAwesomeIcon icon={icon} className={color.replace('border-', 'text-')} />
    </div>
    <div>
      <h3 className="font-medium text-gray-700">{title}</h3>
      <p className="text-lg font-semibold text-gray-900">{count}</p>
    </div>
  </div>
);

export default async function AdminPage() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <SalesChart />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            <PopularCategoriesChart />
            <LowStockAlert />
          </div>

          <ProductsList />
        </div>
      </main>
    </div>
  );
}