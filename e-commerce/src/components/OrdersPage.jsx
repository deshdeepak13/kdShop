import React, { useState, useEffect } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
        const response = await axios.get("http://localhost:3000/api/v1/orders/my-orders", {
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
      order.orderItems.some((item) =>
        item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((order) => (statusFilter === "All" ? true : order.status === statusFilter))
    .filter((order) => {
      if (dateFilter === "All") return true;

      const orderDate = new Date(order.createdAt);
      const currentDate = new Date();

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

  return (
    <div className="flex bg-gray-900 text-white h-screen">
      {/* Filters */}
      <aside className="w-1/4 p-4 bg-gray-800 h-full">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {/* Status Filter */}
        <div className="mb-4">
          <h3 className="text-md font-semibold">Filter by Status</h3>
          <ul className="space-y-2 mt-2">
            {["All", "Pending", "Processing", "Shipped", "Delivered", "Canceled"].map((status) => (
              <li key={status}>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={statusFilter === status}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="mr-2"
                  />
                  {status}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Date Filter */}
        <div className="mb-4">
          <h3 className="text-md font-semibold">Filter by Ordered Date</h3>
          <ul className="space-y-2 mt-2">
            {["All", "Last 30 Days", "Last Year", "2022", "2021", "2019", "Older"].map((date) => (
              <li key={date}>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="date"
                    value={date}
                    checked={dateFilter === date}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="mr-2"
                  />
                  {date}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Orders */}
      <main className="w-3/4 p-4 min-h-[100vh] overflow-y-auto">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 text-white"
          />
        </div>

        {/* Order Cards */}
        {filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="p-4 border rounded shadow-sm bg-gray-800">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Order ID: {order._id}</p>
                    <p className="text-gray-400">Total Items: {order.orderItems.length}</p>
                    <p className="text-gray-400">Total Price: ₹{order.totalPrice}</p>
                    <p
                      className={`px-2 py-1 text-sm font-semibold rounded ${
                        statusColorMap[order.status]
                      }`}
                    >
                      Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                  </div>
                  <button
                    className="text-blue-400 underline"
                    onClick={() => toggleOrderExpansion(order._id)}
                  >
                    {expandedOrderId === order._id ? "Hide Details" : "View Details"}
                  </button>
                </div>
                {/* Expanded Order Details */}
                {expandedOrderId === order._id && (
                  <div className="mt-4 space-y-2">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between p-2 border rounded bg-gray-700"
                      >
                        <div className="flex items-center">
                          <img
                            src={`http://localhost:3000/public/images/${item.imageUrl || "default-product.jpg"}`}
                            alt={item.productName}
                            className="w-12 h-12 mr-4"
                          />
                          <div>
                            <p className="font-semibold">{item.productName || "Product Name"}</p>
                            <p className="text-gray-400">Quantity: {item.quantity}</p>
                            <p className="text-gray-400">Price: ₹{item.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <h4 className="font-semibold">Shipping Address:</h4>
                      <p>{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                      <p>{order.shippingAddress.state}, {order.shippingAddress.country}</p>
                      <p>Mobile: {order.shippingAddress.mobile}</p>
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
