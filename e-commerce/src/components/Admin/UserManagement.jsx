import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/admin/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`, // Add the token for authorization
          },
        }
      );
      setUsers(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  // Delete user from backend
  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/admin/users/${id}`,
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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h2 className="text-3xl font-bold mb-4">User Management</h2>
      <table className="w-full bg-gray-800 rounded shadow">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            // if (user.role !== 'admin') {
            return (
              <tr key={user._id} className="hover:bg-gray-700">
                <td className="border-b border-gray-600 px-4 py-2">
                  {user.name}<span className="text-green-600 text-xl">{user.role==="admin"?"*":""}</span>
                </td>
                <td className="border-b border-gray-600 px-4 py-2">
                  {user.email}
                </td>
                <td className="border-b border-gray-600 px-4 py-2">
                  <button
                    className={`px-4 py-1 text-white rounded ${
                      user.role === "admin"
                        ? "cursor-not-allowed bg-red-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    disabled={user.role === "admin"}
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
            // }
            return null; // If the user is an admin, render nothing
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
