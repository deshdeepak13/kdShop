import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice"; // Import actions
// import { useSnackbar } from "./SnackbarProvider";

const ProductCard = ({ id, name, price, originalPrice, discount, imageUrl, stock,isWishlisted }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);
  const wishlist = useSelector((state) => state.wishlist.wishlistItems || []);
  // const showSnackbar = useSnackbar();

  // Check if the product is already in the wishlist
  // const isWishlisted = wishlist.some((item) => item.id === id);

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      // showSnackbar({
      //   message: "Please login to add items to your cart!",
      //   type: "alert",
      //   position: "top-right",
      //   duration: 3000,
      // });
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
    // showSnackbar({
    //   message: "Item added to your cart!",
    //   type: "added-to-cart",
    //   position: "top-right",
    //   duration: 3000,
    // });
  };

  // Handle Wishlist Toggle
  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      // showSnackbar({
      //   message: "Please login to manage your wishlist!",
      //   type: "alert",
      //   position: "top-right",
      //   duration: 3000,
      // });
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(token, user.id, id));
      // showSnackbar({
      //   message: "Item removed from your wishlist!",
      //   type: "removed-from-wishlist",
      //   position: "top-right",
      //   duration: 3000,
      // });
    } else {
      dispatch(
        addToWishlist(token, user.id, { id, name, price, imageUrl, stock })
      );
      // showSnackbar({
      //   message: "Item added to your wishlist!",
      //   type: "added-to-wishlist",
      //   position: "top-right",
      //   duration: 3000,
      // });
    }
  };

  return (
    <div className="w-64 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-shadow bg-gradient-to-br from-gray-800 to-gray-900 relative">
      {/* Ribbon for Discount */}
      {discount && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {discount}% OFF
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full h-40 bg-gray-700 flex items-center justify-center">
        <img
          className="h-full w-auto object-contain max-h-40 transform hover:scale-105 transition-transform"
          src={imageUrl}
          alt={name}
        />
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-200 truncate">{name}</h3>

        {/* Price Section */}
        <div className="mt-2 flex items-center space-x-2">
          <p className="text-lg font-bold text-gray-100">₹{price}</p>
          {discount && (
            <p className="text-xs line-through text-gray-400">₹{originalPrice}</p>
          )}
        </div>

        {/* Stock Indicator */}
        <p
          className={`mt-1 text-xs font-medium ${
            stock > 0 ? "text-green-400" : "text-red-500"
          }`}
        >
          {stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        {/* Actions */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-xs text-white transition-colors shadow-md ${
              stock > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            {stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>

          <button
            onClick={handleWishlistToggle}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-xs transition-colors shadow-md ${
              isWishlisted
                ? "bg-pink-600 text-white hover:bg-pink-700"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            {isWishlisted ? "Remove" : "Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
