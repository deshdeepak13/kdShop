import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import initializeAuth from './auth/initializeAuth';
import './components/App.css';

import Login from './components/Login';
import Signup from './components/Signup';
import AdminLogin from './components/Admin/AdminLogin';

const Home = lazy(() => import('./components/Home'));
const Search = lazy(() => import('./components/Search'));
const Cart = lazy(() => import('./components/Cart'));
const Checkout = lazy(() => import('./components/Checkout'));
const Profile = lazy(() => import('./components/Profile/Profile'));
const OrdersPage = lazy(() => import('./components/OrdersPage'));
const WishList = lazy(() => import('./components/WishList'));
const CouponsPage = lazy(() => import('./components/Coupons'));

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    initializeAuth(dispatch); // Initialize authentication
  }, [dispatch]);

  // Handlers for modals
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);
  const openSignup = () => setIsSignupOpen(true);
  const closeSignup = () => setIsSignupOpen(false);

  // List of routes where Navbar should not be displayed
  const excludeNavbarRoutes = ['/admin'];

  return (
    <>
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Conditionally render Navbar */}
      {!excludeNavbarRoutes.includes(location.pathname) && (
        <Navbar openLogin={openLogin} openSignup={openSignup} />
      )}

      {/* Main content */}
      <div className={`app-container ${isLoginOpen || isSignupOpen ? 'blur' : ''}`}>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<Loading />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/search"
            element={
              <Suspense fallback={<Loading />}>
                <Search />
              </Suspense>
            }
          />
          <Route
            path="/cart"
            element={
              <Suspense fallback={<Loading />}>
                <Cart />
              </Suspense>
            }
          />
          <Route
            path="/checkout"
            element={
              <Suspense fallback={<Loading />}>
                <Checkout />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<Loading />}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/coupons"
            element={
              <Suspense fallback={<Loading />}>
                <CouponsPage />
              </Suspense>
            }
          />
          <Route
            path="/orders"
            element={
              <Suspense fallback={<Loading />}>
                <OrdersPage />
              </Suspense>
            }
          />
          <Route
            path="/wishlist"
            element={
              <Suspense fallback={<Loading />}>
                <WishList />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<Loading />}>
                <AdminLogin />
              </Suspense>
            }
          />
        </Routes>
      </div>

      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={closeLogin}>
        <Login onClose={closeLogin} />
      </Modal>

      {/* Signup Modal */}
      <Modal isOpen={isSignupOpen} onClose={closeSignup}>
        <Signup onClose={closeSignup} />
      </Modal>
      </div>
    </>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
