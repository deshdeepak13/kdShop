import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiChevronDown, FiChevronUp, FiInfo, FiXCircle, FiCalendar, FiFilter, FiSearch } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MyOrders = () => {
  // ... existing state declarations ...
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

   // Add mobile menu state
   const [showMobileFilters, setShowMobileFilters] = useState(false);
   const currentYear = new Date().getFullYear();
   const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);
 
   // ... existing useEffect and filteredOrders logic ...

  

  const statusColorMap = {
    Pending: "bg-yellow-600 text-yellow-200",
    Processing: "bg-blue-600 text-blue-200",
    Shipped: "bg-purple-600 text-purple-200",
    Delivered: "bg-green-600 text-green-200",
    Canceled: "bg-red-600 text-red-200",
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders
    .filter((order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by order ID
    )
    .filter((order) => (statusFilter === "All" ? true : order.status === statusFilter))
    .filter((order) => {
      if (dateFilter === "All") return true;

      

      if (dateFilter === "Last 30 Days") {
        const last30Days = new Date();
        last30Days.setDate(currentDate.getDate() - 30);
        return orderDate >= last30Days;
      }
      if (dateFilter === "Last Year") {
        return orderDate.getFullYear() === currentDate.getFullYear() - 1;
      }
      return orderDate.getFullYear() === parseInt(dateFilter);
    });

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // const statusColorMap = { /* same as before */ };

 

  return (
    <div className="flex flex-col md:flex-row bg-gray-900 text-white min-h-screen">
      {/* Mobile Filters Toggle */}
      <div className="md:hidden p-4 border-b border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-bold">My Orders</h1>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 text-blue-400"
        >
          <FiFilter className="text-lg" />
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters - Mobile */}
      {showMobileFilters && (
        <aside className="md:hidden p-4 bg-gray-800 border-b border-gray-700 overflow-hidden">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiXCircle size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search Order ID</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Order ID..."
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(statusColorMap).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {["All", "Last 30 Days", "Last Year", ...yearOptions].map((date) => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Filters - Desktop */}
      <aside className="hidden md:block w-full md:w-80 p-6 bg-gray-800 border-r border-gray-700 sticky top-0 h-screen overflow-y-auto">
        {/* ... same desktop filter content as before ... */}
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Filters</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <label htmlFor="search" className="block font-medium mb-2 text-gray-300">
            Search by Order ID:
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID"
            className="w-full p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <label htmlFor="status" className="block font-medium mb-2 text-gray-300">
            Filter by Status:
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          >
            {["All", "Pending", "Processing", "Shipped", "Delivered", "Canceled"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="mb-6">
          <label htmlFor="date" className="block font-medium mb-2 text-gray-300">
            Filter by Ordered Date:
          </label>
          <select
            id="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          >
            {["All", "Last 30 Days", "Last Year", "2022", "2021", "2019", "Older"].map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      </aside>

      {/* Orders List */}
      <main className="flex-1 p-4 md:p-6 overflow-x-hidden overflow-y-auto h-screen scrollbar-hide">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-gray-800 rounded-lg">
                <Skeleton height={120} baseColor="#1f2937" highlightColor="#374151" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <FiXCircle className="text-4xl text-red-400 mx-auto mb-4" />
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <FiInfo className="text-4xl text-blue-400 mx-auto mb-4" />
            <p className="text-gray-300">No orders found matching your criteria</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCalendar className="text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-gray-400 truncate">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <h3 className="font-semibold truncate">Order #{order._id}</h3>
                    <p className="text-gray-400 text-sm">
                      {order.orderItems.length} items • ₹{order.totalPrice}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <span className={`px-3 py-1 rounded-full text-sm ${statusColorMap[order.status]}`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => toggleOrderExpansion(order._id)}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      {expandedOrderId === order._id ? <FiChevronUp /> : <FiChevronDown />}
                      <span className="sm:hidden">Details</span>
                    </button>
                  </div>
                </div>

                {expandedOrderId === order._id && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="grid gap-4">
                      {order.orderItems.map((item) => (
                        <div key={item.productId} className="flex items-start gap-4 p-3 bg-gray-700 rounded-lg">
                          <img
                            src={`${item.imageUrl || "default-product.jpg"}`}
                            alt={item.productName}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-medium truncate">{item.productName}</h4>
                            <p className="text-sm text-gray-400">
                              ₹{item.price} × {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}

                      <div className="p-3 bg-gray-700 rounded-lg">
                        <h4 className="font-medium mb-2">Shipping Address</h4>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </p>
                          <p>
                            {order.shippingAddress.country} - {order.shippingAddress.pincode}
                          </p>
                          <p>Mobile: {order.shippingAddress.mobile}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;