import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import {
  fetchWishlistItems,
  removeFromWishlist,
} from "../redux/wishlistSlice";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlistItems, loading, error } = useSelector((state) => state.wishlist);

  // const token = "your-auth-token"; // Replace with actual token from auth state
  // const userId = "user-id"; // Replace with actual user ID from auth state
  const { token, user, isLoggedIn } = useSelector((state) => state.auth);

  // Fetch wishlist on component mount
  useEffect(() => {
    dispatch(fetchWishlistItems(token, user.id));
  }, [dispatch, token, user.id]);

  // Remove item from wishlist
  const handleDelete = (productId) => {
    dispatch(removeFromWishlist(token, user.id, productId));
  };

  return (
    <div className="p-8 mt-20">
      <h2 className="text-3xl font-semibold mb-6">My Wishlist</h2>

      {loading ? (
        <p>Loading wishlist...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div key={product._id} className="relative">
              <ProductCard
                name={product.name}
                price={product.currentPrice}
                originalPrice={product.MRP}
                discount={product.discount}
                imageUrl={`http://localhost:3000/public/images/${product.imageUrl?.[0] || 'default-product.jpg'}`}
              />

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(product._id)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
