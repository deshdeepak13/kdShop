import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import DropdownMenu from './DropDownMenu';
import { useSelector } from 'react-redux';
import { FaHome, FaSearch, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

const Navbar = ({ openLogin, openSignup }) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getInitials = (name) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="bg-gray-950 sticky top-0 left-0 w-full z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-purple-300 transition-colors"
          >
            {"<ddShop"}
            <span className="text-purple-500">{"/>"}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-1 text-white hover:text-purple-300 transition-colors ${
                  isActive ? 'text-purple-300' : ''
                }`
              }
            >
              <FaHome className="inline-block" />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) =>
                `flex items-center space-x-1 text-white hover:text-purple-300 transition-colors ${
                  isActive ? 'text-purple-300' : ''
                }`
              }
            >
              <FaSearch className="inline-block" />
              <span>Search</span>
            </NavLink>

            {isLoggedIn ? (
              <>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `flex items-center space-x-1 text-white hover:text-purple-300 transition-colors ${
                      isActive ? 'text-purple-300' : ''
                    }`
                  }
                >
                  <FaShoppingCart className="inline-block" />
                  <span>Cart</span>
                </NavLink>
                <DropdownMenu
                  title={user.name}
                  initials={getInitials(user.name)}
                />
              </>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={openLogin}
                  className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded transition-colors"
                >
                  <FiLogIn className="inline-block" />
                  <span>Login</span>
                </button>
                <button
                  onClick={openSignup}
                  className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded transition-colors"
                >
                  <FiUserPlus className="inline-block" />
                  <span>Signup</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            {isLoggedIn && (
              <DropdownMenu
                title={user.name}
                initials={getInitials(user.name)}
                mobile
              />
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-purple-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 pb-4">
            <div className="px-4 pt-2 space-y-2">
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-2 text-white px-3 py-2 rounded-lg ${
                    isActive ? 'bg-purple-600' : 'hover:bg-gray-800'
                  }`
                }
              >
                <FaHome />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/search"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-2 text-white px-3 py-2 rounded-lg ${
                    isActive ? 'bg-purple-600' : 'hover:bg-gray-800'
                  }`
                }
              >
                <FaSearch />
                <span>Search</span>
              </NavLink>

              {isLoggedIn ? (
                <>
                  <NavLink
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 text-white px-3 py-2 rounded-lg ${
                        isActive ? 'bg-purple-600' : 'hover:bg-gray-800'
                      }`
                    }
                  >
                    <FaShoppingCart />
                    <span>Cart</span>
                  </NavLink>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      openLogin();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-white px-3 py-2 rounded-lg hover:bg-gray-800"
                  >
                    <FiLogIn />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => {
                      openSignup();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-white px-3 py-2 rounded-lg hover:bg-gray-800"
                  >
                    <FiUserPlus />
                    <span>Signup</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;