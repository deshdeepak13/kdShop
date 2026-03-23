import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  FiUsers,
  FiBox,
  FiShoppingBag,
  FiDollarSign,
  FiActivity,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalProductsOrderedCount: 0,
    totalRevenue: 0,
    avgProductValue: 0,
    avgProductperCheckout: 0,
    ordersByCategoryData: { labels: [], datasets: [] },
    revenueOverTimeData: { labels: [], datasets: [] },
    userGrowthData: { labels: [], datasets: [] },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/api/v1/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
            },
          }
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6 bg-gray-900 text-gray-200 min-h-screen p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h2>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={dashboardData.totalProducts}
          icon={<FiBox />}
          color="bg-blue-600"
        />
        <StatCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon={<FiUsers />}
          color="bg-purple-600"
        />
        <StatCard
          title="Total Orders"
          value={dashboardData.totalOrders}
          icon={<FiShoppingBag />}
          color="bg-green-600"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${dashboardData.totalRevenue.toLocaleString()}`}
          icon={<FiDollarSign />}
          color="bg-yellow-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Avg. Order Value"
          value={`₹${dashboardData.avgOrderValue}`}
          icon={<FiActivity />}
          color="bg-indigo-600"
        />
        <StatCard
          title="Avg. Product Value"
          value={`₹${dashboardData.avgProductValue}`}
          icon={<FiActivity />}
          color="bg-indigo-600"
        />
        <StatCard
          title="Products / Checkout"
          value={dashboardData.avgProductperCheckout}
          icon={<FiBox />}
          color="bg-indigo-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-gray-800 shadow-xl p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FiShoppingBag className="text-blue-500" /> Orders by Category
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <Bar
              data={dashboardData.ordersByCategoryData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Line Chart for Revenue Over Time */}
        <div className="bg-gray-800 shadow-xl p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FiDollarSign className="text-green-500" /> Revenue Trend
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <Line
              data={dashboardData.revenueOverTimeData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Line Chart for User Growth */}
        <div className="bg-gray-800 shadow-xl p-6 rounded-xl border border-gray-700 lg:col-span-2">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FiUsers className="text-purple-500" /> User Growth
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <Line
              data={dashboardData.userGrowthData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-gray-800 shadow-lg p-6 rounded-xl border border-gray-700 flex items-center justify-between hover:translate-y-[-2px] transition-transform">
    <div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
    <div
      className={`p-4 rounded-full text-white text-xl ${color} bg-opacity-80`}
    >
      {icon}
    </div>
  </div>
);

export default Dashboard;
