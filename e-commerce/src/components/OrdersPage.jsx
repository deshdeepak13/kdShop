import React, { useState, useEffect } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Tracks expanded order
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3000/api/v1/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust token retrieval as needed
            },
          }
        );
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...orders];

      // Filter by search term
      filtered = filtered.filter((order) =>
        order.orderItems.some((item) =>
          item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      // Filter by status
      if (statusFilter !== "All") {
        filtered = filtered.filter((order) => order.status === statusFilter);
      }

      // Filter by date
      if (dateFilter !== "All") {
        const currentDate = new Date();
        filtered = filtered.filter((order) => {
          const orderDate = new Date(order.createdAt);
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
      }

      setFilteredOrders(filtered);
    };

    applyFilters();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex ">
      {/* Filters */}
      <aside className="w-1/4 p-4 bg-gray-100">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {/* Status Filter */}
        <div className="mb-4">
          <h3 className="text-md font-semibold">Filter by Status</h3>
          <ul className="space-y-2 mt-2">
            {["All", "In Transit", "Delivered", "Packed", "Placed"].map(
              (status) => (
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
              )
            )}
          </ul>
        </div>

        {/* Date Filter */}
        <div className="mb-4">
          <h3 className="text-md font-semibold">Filter by Ordered Date</h3>
          <ul className="space-y-2 mt-2">
            {[
              "All",
              "Last 30 Days",
              "Last Year",
              "2022",
              "2021",
              "2019",
              "Older",
            ].map((date) => (
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
      <main className="w-3/4 p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Order Cards */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className={`p-4 border rounded shadow-sm ${
                expandedOrderId === order._id ? "bg-gray-100" : ""
              }`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleOrderExpansion(order._id)}
              >
                <div>
                  <p className="font-semibold">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600">
                    Status: {order.status}
                  </p>
                </div>
                <p className="font-semibold text-lg">₹{order.totalPrice}</p>
              </div>

              {expandedOrderId === order._id && (
                <div
                  className={`mt-4 space-y-2 transition-all duration-300 ease-in-out ${
                    expandedOrderId === order._id
                      ? "max-h-screen opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm text-gray-600">
                    Ordered on: {new Date(order.createdAt).toDateString()}
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2">Items:</h4>
                    {order.orderItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center mb-2"
                      >
                        <div className="flex items-center">
                          <img
                            src={`http://localhost:3000/public/images/${
                              item.imageUrl?.[0] || "default-product.jpg"
                            }`}
                            alt={item.productName}
                            className="w-16 h-16 mr-4 rounded object-contain"
                          />
                          <p>
                            {item.productName} x {item.quantity}
                          </p>
                        </div>
                        <p>₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyOrders;
