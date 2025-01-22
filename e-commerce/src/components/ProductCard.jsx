import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../redux/cartSlice"; // Import addToCart action
import { addToWishlist } from "../redux/wishlistSlice"; // Import addToWishlist action

const ProductCard = ({ id, name, price, originalPrice, discount, imageUrl, stock }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token); // Assuming token is stored in auth slice

  // Handle adding an item to the cart
  const handleAddToCart = () => {
    if (isLoggedIn && user && user.id) {
      dispatch(
        addItemToCart({
          userId: user.id,
          productId: id,
          quantity: 1,
          token,
        })
      );
    } else {
      alert("You need to be logged in to add items to the cart.");
    }
  };

  // Handle adding an item to the wishlist
  const handleAddToWishlist = () => {
    if (isLoggedIn && user && user.id) {
      dispatch(
        addToWishlist(token, user.id, { id, name, price, imageUrl, stock })
      );
    } else {
      alert("You need to be logged in to add items to the wishlist.");
    }
  };

  return (
    <div className="w-64 h-96 rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Product Image */}
      <img className="w-full h-48 object-contain" src={imageUrl} alt={name} />

      {/* Product Details */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>

        {/* Product Price Section */}
        <div className="mt-2 flex items-center space-x-2">
          {/* If discount exists, show both price and original price */}
          <p className="text-xl font-bold text-gray-900">₹{price}</p>
          {discount && (
            <>
              <p className="text-sm line-through text-gray-500">₹{originalPrice}</p>
              {/* Discount percentage */}
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 text-white bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded-lg"
          >
            Add to Cart
          </button>

          {/* Add to Wishlist Button */}
          <button
            onClick={handleAddToWishlist}
            className="flex-1 text-white bg-pink-600 hover:bg-pink-700 font-semibold py-2 px-4 rounded-lg"
          >
            Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
