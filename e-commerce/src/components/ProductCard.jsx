import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { addItemToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { useSnackbar } from "./SnackbarProvider";

const ProductCard = ({ id, name, price, originalPrice, discount, imageUrl, stock, isWishlisted }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);
  const showSnackbar = useSnackbar();

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      showSnackbar({
        message: "Please login to add items to your cart!",
        type: "alert",
        position: "top-right",
        duration: 3000,
      });
      return;
    }
    dispatch(
      addItemToCart({
        userId: user.id,
        productId: id,
        quantity: 1,
        token,
      })
    );
    showSnackbar({
      message: "Item added to your cart!",
      type: "added-to-cart",
      position: "top-right",
      duration: 3000,
    });
  };

  // Handle Wishlist Toggle
  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      showSnackbar({
        message: "Please login to manage your wishlist!",
        type: "alert",
        position: "top-right",
        duration: 3000,
      });
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(token, user.id, id));
      showSnackbar({
        message: "Item removed from your wishlist!",
        type: "deleted",
        position: "top-right",
        duration: 3000,
      });
    } else {
      dispatch(
        addToWishlist(token, user.id, { id, name, price, imageUrl, stock })
      );
      showSnackbar({
        message: "Item added to your wishlist!",
        type: "added-to-wishlist",
        position: "top-right",
        duration: 3000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="w-64 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-shadow bg-gradient-to-br from-gray-800 to-gray-900 relative"
    >
      {/* Discount Ribbon Animation */}
      <AnimatePresence>
        {discount && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
          >
            {discount}% OFF
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Image with Hover Animation */}
      <motion.div 
        className="relative w-full h-40 bg-gray-700 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
      >
        <motion.img
          className="h-full w-auto object-contain max-h-40"
          src={imageUrl}
          alt={name}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        />
      </motion.div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-200 truncate">{name}</h3>

        {/* Price Section */}
        <div className="mt-2 flex items-center space-x-2">
          <motion.p 
            className="text-lg font-bold text-gray-100"
            whileHover={{ scale: 1.05 }}
          >
            ₹{price}
          </motion.p>
          {discount && (
            <p className="text-xs line-through text-gray-400">₹{originalPrice}</p>
          )}
        </div>

        {/* Stock Indicator */}
        <motion.p
          className={`mt-1 text-xs font-medium ${
            stock > 0 ? "text-green-400" : "text-red-500"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {stock > 0 ? "In Stock" : "Out of Stock"}
        </motion.p>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          <motion.button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-xs text-white transition-colors shadow-md ${
              stock > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            {stock > 0 ? "Add to Cart" : "Out of Stock"}
          </motion.button>

          <motion.button
            onClick={handleWishlistToggle}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-lg font-medium text-xs transition-colors shadow-md ${
              isWishlisted
                ? "bg-pink-600 text-white hover:bg-pink-700"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isWishlisted ? "filled" : "empty"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Heart 
                  size={20}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;