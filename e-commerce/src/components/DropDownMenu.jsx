import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logout from "./Logout";
import { 
  FiPackage, 
  FiHeart, 
  FiUser, 
  FiTag, 
  FiLogOut,
  FiChevronDown 
} from 'react-icons/fi';

const DropdownMenu = ({ title, initials, mobile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative inline-block text-left z-30">
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="text-white flex items-center justify-center hover:text-purple-300 transition-colors"
      >
        {mobile ? (
          <span className="bg-purple-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm">
            {initials}
          </span>
        ) : (
          <>
            <span className="hidden md:inline">{title}</span>
            <span className="bg-purple-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm ml-2 md:hidden">
              {initials}
            </span>
            <FiChevronDown className={`ml-1 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5">
          <div className="py-2">
            <NavLink
              to="/orders"
              onClick={closeDropdown}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm space-x-2 ${
                  isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <FiPackage className="text-lg" />
              <span>My Orders</span>
            </NavLink>

            <NavLink
              to="/wishlist"
              onClick={closeDropdown}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm space-x-2 ${
                  isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <FiHeart className="text-lg" />
              <span>My Wishlist</span>
            </NavLink>

            <NavLink
              to="/profile"
              onClick={closeDropdown}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm space-x-2 ${
                  isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <FiUser className="text-lg" />
              <span>My Profile</span>
            </NavLink>

            <NavLink
              to="/coupons"
              onClick={closeDropdown}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm space-x-2 ${
                  isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <FiTag className="text-lg" />
              <span>Coupons</span>
            </NavLink>

            <button
              onClick={closeDropdown}
              className="flex items-center w-full px-4 py-2 text-sm space-x-2 text-gray-300 hover:bg-red-500"
            >
              <FiLogOut className="text-lg" />
              <Logout />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;