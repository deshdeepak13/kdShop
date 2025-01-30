import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCartFromBackend } from "../redux/cartSlice";
import { useSnackbar } from "./SnackbarProvider";


// Load Stripe with your publishable key
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

const CheckoutForm = ({ totalAmount, onClose, address }) => {
  const addSnackbar = useSnackbar();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { token, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClearCart = async () => {
    try {
      dispatch(clearCartFromBackend(token, user.id));
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const createOrder = async (paymentId) => {
    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.currentPrice,
      }));

      const { data } = await axios.post(
        "http://localhost:3000/api/v1/orders",
        {
          items: orderItems,
          shippingAddress: address,
          totalAmount: totalAmount,
          paymentId: paymentId,
          userId: user.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Order created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded correctly.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/payments/create-payment-intent", 
        {
          amount: totalAmount * 100,
          currency: 'inr',
          orderItems: cartItems.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
        }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Cardholder Name",
          },
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Payment successful, create a new order
      await createOrder(paymentIntent.id);
      await handleClearCart();
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
      addSnackbar({message:`Order Placed Successfully !!!`,type:"payment-successful"});
    } catch (err) {
      setError("Payment failed. Please try again.");
      addSnackbar({message:`${error}`,type:"error"});
      // console.error("Payment error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-800 text-white p-6 w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Complete Payment</h2>
      <form onSubmit={handleSubmit}>
        <CardElement className="border p-3 rounded mb-4 bg-gray-700" />
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Payment successful!</p>}
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !stripe || !elements}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

const PaymentModal = ({ totalAmount, onClose, address }) => (
  <Elements stripe={stripePromise}> 
    <CheckoutForm totalAmount={totalAmount} onClose={onClose} address={address} />
  </Elements>
);

export default PaymentModal;
