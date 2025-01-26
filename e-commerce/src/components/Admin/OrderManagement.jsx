import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/admin/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admintoken')}`,
        },
      });
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/admin/order/${id}`,
        { status },
        {
          headers: {  
            Authorization: `Bearer ${localStorage.getItem('admintoken')}`, // Add token from localStorage
          },
        }
      );

      if (response.status === 200) {
        // Update the state optimistically
        setOrders(orders.map(order => order._id === id ? { ...order, status } : order));
      }
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h2 className="text-3xl font-bold mb-4">Order Management</h2>
      <table className="w-full bg-gray-800 rounded shadow">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">Details</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-700">
              <td className="border-b border-gray-600 px-4 py-2">{order._id}</td>
              <td className="border-b border-gray-600 px-4 py-2">
                <p>{order.user?.name || 'Unknown User'}</p>
                <p>Total: ${order.totalPrice}</p>
                <p>Address: {order.shippingAddress?.address || 'No Address Available'}</p>
              </td>
              <td className="border-b border-gray-600 px-4 py-2">{order.status}</td>
              <td className="border-b border-gray-600 px-4 py-2">
                <select
                  className="px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
