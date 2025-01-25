import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import initializeAuth from './auth/initializeAuth';
import { useDispatch } from 'react-redux';
import { useEffect,useState } from 'react';
import "./components/App.css"
import Modal from './components/Modal';


import Login from './components/Login';
import Signup from './components/Signup';
// import Login from 

// import { CssBaseline } from '@mui/material';
// import SimpleBadge from './SimpleBadge';

const Home = lazy(() => import('./components/Home'));
const Search = lazy(() => import('./components/Search'));
const Cart = lazy(() => import('./components/Cart'));
const Checkout = lazy(() => import('./components/Checkout'));
const Profile = lazy(() => import('./components/Profile/Profile'));
// const Login = lazy(() => import('./components/Login'));
// const Signup = lazy(() => import('./components/Signup'));
const OrdersPage = lazy(() => import('./components/OrdersPage'));
const WishList = lazy(() => import('./components/WishList'));
const CouponsPage = lazy(() => import('./components/Coupons'));

const App = () => {

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const openSignup = () => setIsSignupOpen(true);
  const closeSignup = () => setIsSignupOpen(false);



  

  const dispatch = useDispatch();

  useEffect(() => {
    initializeAuth(dispatch); // Call initializeAuth on app start
  }, [dispatch]);

  



  return (
    <Router>
      <Navbar openLogin={openLogin} openSignup={openSignup} />
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
      </Routes>
      </div>

      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={closeLogin}>
        <Login onClose={closeLogin}/>
      </Modal>

      {/* Signup Modal */}
      <Modal isOpen={isSignupOpen} onClose={closeSignup}>
        <Signup onClose={closeSignup}/>
      </Modal>
    </Router>
  );
};

export default App;


