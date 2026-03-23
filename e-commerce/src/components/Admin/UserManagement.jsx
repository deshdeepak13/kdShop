import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`, // Add the token for authorization
          },
        }
      );
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  // Delete user from backend
  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/v1/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`, // Add the token for authorization
          },
        }
      );

      if (response.status === 200) {
        // Remove user from the state after successful delete
        setUsers(users.filter((user) => user._id !== id));
      }
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filters and Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return (
      <div className="text-red-500 text-center mt-20 text-xl">{error}</div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-6">User Management</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search items by name or email..."
          className="w-full md:w-1/3 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-xl border border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-750 text-gray-400 border-b border-gray-700">
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Name
              </th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Email
              </th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Role
              </th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 font-medium flex items-center gap-2">
                    {/* Placeholder Avatar */}
                    <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.role === "admin" ? (
                      <span className="px-3 py-1 bg-purple-900 text-purple-200 rounded-full text-xs font-semibold">
                        Admin
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className={`px-3 py-1 rounded text-sm transition ${
                        user.role === "admin"
                          ? "cursor-not-allowed bg-red-900 text-red-400 opacity-50"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                      disabled={user.role === "admin"}
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No users found.
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

export default UserManagement;
