import React, { useState } from 'react';

const MyOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Dummy orders data
  const orders = [
    {
      id: 'ORD12345',
      productName: 'Product A',
      imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/cycle/w/t/u/legend-24t-bicycle-big-kids-boys-girls-9-to-15-age-24-16-east-original-imags4dwhyzdxgae.jpeg?q=70",
      price: '₹500',
      status: 'Delivered',
      orderedOn: '2023-07-20',
    },
    {
      id: 'ORD12346',
      productName: 'Product B',
      imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/condom/e/v/e/-original-imahfhvhgvpkgbcd.jpeg?q=70",
      price: '₹1200',
      status: 'In Transit',
      orderedOn: '2023-08-10',
    },
    // Add more orders here
  ];

  // Filter the orders based on search term, status, and date
  const filteredOrders = orders
    .filter(order => order.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(order => (statusFilter === 'All' ? true : order.status === statusFilter))
    .filter(order => {
      if (dateFilter === 'All') return true;

      const orderDate = new Date(order.orderedOn);
      const currentDate = new Date();

      if (dateFilter === 'Last 30 Days') {
        const last30Days = new Date();
        last30Days.setDate(currentDate.getDate() - 30);
        return orderDate >= last30Days;
      }
      if (dateFilter === 'Last Year') {
        return orderDate.getFullYear() === currentDate.getFullYear() - 1;
      }
      return orderDate.getFullYear() === parseInt(dateFilter);
    });

  return (
    <div className="flex mt-20">
      {/* Aside: Filters */}
      <aside className="w-1/4 p-4 bg-gray-100">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {/* Status Filter */}
        <div className="mb-4">
          <h3 className="text-md font-semibold">Filter by Status</h3>
          <ul className="space-y-2 mt-2">
            {['All', 'In Transit', 'Delivered', 'Packed', 'Placed'].map(status => (
              <li key={status}>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={statusFilter === status}
                    onChange={e => setStatusFilter(e.target.value)}
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
            {['All', 'Last 30 Days', 'Last Year', '2022', '2021', '2019', 'Older'].map(date => (
              <li key={date}>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="date"
                    value={date}
                    checked={dateFilter === date}
                    onChange={e => setDateFilter(e.target.value)}
                    className="mr-2"
                  />
                  {date}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main: Orders */}
      <main className="w-3/4 p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Order Cards */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="flex justify-between p-4 border rounded shadow-sm">
              <div className="flex items-center">
                <img src={order.imageUrl} alt={order.productName} className="w-16 h-16 mr-4" />
                <div>
                  <p className="font-semibold">{order.productName}</p>
                  <p className="text-gray-600">Order ID: {order.id}</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-lg font-semibold">{order.price}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <p className="text-sm text-gray-600">Status: {order.status}</p>
                <p className="text-sm text-gray-600">Ordered on: {new Date(order.orderedOn).toDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyOrders;
