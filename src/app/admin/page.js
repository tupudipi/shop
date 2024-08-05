import SalesChart from "./components/SalesChart"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faShoppingCart, faStar, faUsers } from "@fortawesome/free-solid-svg-icons";

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className="mr-4 text-blue-600 text-3xl">
      {icon}
    </div>
    <div>
      <h3 className="font-medium text-gray-700">{title}</h3>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default function AdminPage() {
  const stats = [
    { title: "Users", value: "1,234", icon: <FontAwesomeIcon icon={faUsers} /> },
    { title: "Products", value: "567", icon: <FontAwesomeIcon icon={faBoxOpen} /> },
    { title: "Orders", value: "1649", icon: <FontAwesomeIcon icon={faShoppingCart} /> },
    { title: "Reviews", value: "1000", icon: <FontAwesomeIcon icon={faStar} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto">
        <div className="p-4 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
          <SalesChart />
        </div>
      </main>
    </div>
  );
}