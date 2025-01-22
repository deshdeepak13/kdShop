import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { clearCartFromBackend } from "../redux/cartSlice"; // Replace with your cart clearing action

// Load Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51QXMVwLSATmnoDbEIG8x6gzCCo14muOc9aCgy9YfdGrFnc5TKqIupJLm04noPIiXKubSVN6Dyi6Es0IWQBqH6h5O001NXuWoDu");

const CheckoutForm = ({ totalAmount, onClose, address }) => {
  const stripe = useStripe();
  const elements = useElements();
  // const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const { token, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch(); // Dispatch to clear cart
  const navigate = useNavigate(); // For navigation


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
    // console.log()


    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/payments/create-payment-intent", 
        {
          amount: totalAmount*100,
          currency:'inr',
          orderItems: cartItems.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
          //  shippingAddress: address,
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
            name: "cardholderName",
            // address:address
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

      // await createOrder({
      //   items: cartItems.map((item) => ({
      //     productId: item.product._id,
      //     quantity: item.quantity,
      //     price: item.product.currentPrice,
      //   })),
      //   totalAmount: paymentIntent.amount / 100,
      //   shippingAddress: address,
      //   paymentId: paymentIntent.id,
      //   userId: user.id,
      // });


      await handleClearCart();
        setSuccess(true);
        // dispatch(clearCart)
        setTimeout(() => {
          navigate("/");
          // onClose();
        }, 1000);
      } catch (err) {
        setError("Payment failed. Please try again.");
        console.error("Payment error:", err);
      }
  
      setLoading(false);
    };

  return (
    <div>
      {console.log(address)}
      <h2 className="text-lg font-semibold mb-4">Complete Payment</h2>
      <form onSubmit={handleSubmit}>
        <CardElement className="border p-2 rounded mb-4" />
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Payment successful!</p>}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !stripe || !elements}
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
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
    {/* {console.log(address)} */}
    <CheckoutForm totalAmount={totalAmount} onClose={onClose} address={address} />
  </Elements>
);

export default PaymentModal;