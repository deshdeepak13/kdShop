import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
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
        const response = await axios.get("http://localhost:3000/api/v1/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        });
        setDashboardData(response.data);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6 bg-gray-900 text-gray-200 min-h-screen p-6">
      {/* Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 shadow-md p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-2xl font-bold">{dashboardData.totalProducts}</p>
        </div>
        <div className="bg-gray-800 shadow-md p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">{dashboardData.totalUsers}</p>
        </div>
        <div className="bg-gray-800 shadow-md p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl font-bold">{dashboardData.totalProductsOrderedCount}</p>
        </div>
        <div className="bg-gray-800 shadow-md p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Checkouts</h3>
          <p className="text-2xl font-bold">{dashboardData.totalOrders}</p>
        </div>
        <div className="bg-gray-800 shadow-md p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Average Checkout Value</h3>
          <p className="text-2xl font-bold">₹{dashboardData.avgOrderValue}</p>
        </div>
        <div className="bg-gray-800 shadow-md p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Average Order Value</h3>
          <p className="text-2xl font-bold">₹{dashboardData.avgProductValue}</p>
        </div>
        <div className="bg-gray-800 shadow-md p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Avg. Products per Checkout</h3>
          <p className="text-2xl font-bold">{dashboardData.avgProductperCheckout}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-gray-800 shadow-md p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Orders by Category</h3>
          <Bar data={dashboardData.ordersByCategoryData} />
        </div>

        {/* Line Chart for Revenue Over Time */}
        <div className="bg-gray-800 shadow-md p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
          <Line data={dashboardData.revenueOverTimeData} />
        </div>

        {/* Line Chart for User Growth */}
        <div className="bg-gray-800 shadow-md p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <Line data={dashboardData.userGrowthData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
