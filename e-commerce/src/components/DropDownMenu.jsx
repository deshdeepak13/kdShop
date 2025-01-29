import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logout from "./Logout";

const DropdownMenu = ({title}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left z-30">
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="text-white flex items-center justify-center"
      >
        {title}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.44l3.71-3.21a.75.75 0 111.04 1.08l-4.25 3.68a.75.75 0 01-1.04 0L5.21 8.31a.75.75 0 01.02-1.1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? 'block px-4 py-2 text-sm text-gray-700 bg-gray-200' : 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' // Apply red text when active, purple otherwise
              }
              activeClassName="font-semibold"
            >
              My Orders
            </NavLink>
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                isActive ? 'block px-4 py-2 text-sm text-gray-700 bg-gray-200' : 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' // Apply red text when active, purple otherwise
              }
              activeClassName="font-semibold"
            >
              My WishList
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? 'block px-4 py-2 text-sm text-gray-700 bg-gray-200' : 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' // Apply red text when active, purple otherwise
              }
              activeClassName="font-semibold"
            >
              My Profile
            </NavLink>
            <NavLink
              to="/coupons"
              className={({ isActive }) =>
                isActive ? 'block px-4 py-2 text-sm text-gray-700 bg-gray-200' : 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' // Apply red text when active, purple otherwise
              }
              activeClassName="font-semibold"
            >
              Coupons
            </NavLink>
            <NavLink
              to="#"
              className={({ isActive }) =>
                isActive ? 'block px-4 py-2 text-sm text-gray-700 bg-gray-200' : 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' // Apply red text when active, purple otherwise
              }
              activeClassName="font-semibold"
            >
              <Logout/>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
