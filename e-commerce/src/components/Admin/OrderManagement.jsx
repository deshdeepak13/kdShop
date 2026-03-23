import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );
      setOrders(response.data);
    } catch (err) {
      setError("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/v1/admin/order/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`, // Add token from localStorage
          },
        }
      );

      if (response.status === 200) {
        // Update the state optimistically
        setOrders(
          orders.map((order) =>
            order._id === id ? { ...order, status } : order
          )
        );
      }
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Filters and Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-900 text-green-300";
      case "shipped":
        return "bg-blue-900 text-blue-300";
      case "processing":
        return "bg-yellow-900 text-yellow-300";
      case "canceled":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  if (error) {
    return (
      <div className="text-red-500 text-center mt-20 text-xl">{error}</div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-6">Order Management</h2>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Order ID or User Name..."
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-xl border border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-750 text-gray-400 border-b border-gray-700">
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Order ID
              </th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                User
              </th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Total
              </th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Date
              </th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Status
              </th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-sm">{order._id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">
                      {order.user?.name || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.shippingAddress?.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-green-400">
                    ₹{order.totalPrice}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="px-3 py-1 bg-gray-900 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500"
                      onChange={(e) => changeStatus(order._id, e.target.value)}
                      value={order.status}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
