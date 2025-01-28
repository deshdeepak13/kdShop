import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import DropdownMenu from './DropDownMenu';
import { useSelector } from 'react-redux';

const Navbar = ({ openLogin, openSignup }) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  return (
    <>
      <nav className="bg-gray-950 top-0 left-0 w-full z-50 shadow-lg sticky">
        <div className="flex py-4 px-10 justify-between items-center">
          {/* Logo */}
          <div className="logo font-bold text-2xl text-white tracking-wide">
            <Link to="/" className="hover:text-purple-300 transition duration-300">
              pottyShop
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="items flex gap-8 text-lg">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-purple-300 transition duration-300 ${
                  isActive ? 'text-purple-300 underline' : 'text-white'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) =>
                `hover:text-purple-300 transition duration-300 ${
                  isActive ? 'text-purple-300 underline' : 'text-white'
                }`
              }
            >
              Search
            </NavLink>

            {isLoggedIn ? (
              <>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `hover:text-purple-300 transition duration-300 ${
                      isActive ? 'text-purple-300 underline' : 'text-white'
                    }`
                  }
                >
                  Cart
                </NavLink>

                <div>
                  <DropdownMenu title={user.name} />
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className="text-white font-semibold rounded-md bg-purple-600 px-4 py-1 hover:bg-purple-500 transition duration-300"
                >
                  Login
                </button>
                <button
                  onClick={openSignup}
                  className="text-white font-semibold rounded-md bg-purple-600 px-4 py-1 hover:bg-purple-500 transition duration-300"
                >
                  Signup
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
