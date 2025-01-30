import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { fetchWishlistItems, removeFromWishlist } from "../redux/wishlistSlice";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlistItems, loading, error } = useSelector((state) => state.wishlist);
  const { token, user, isLoggedIn } = useSelector((state) => state.auth);

  // Fetch wishlist items when the component mounts
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchWishlistItems(token, user.id));
    }
  }, [dispatch, token, user, isLoggedIn]);

  // Handle wishlist removal
  const handleDelete = (productId) => {
    dispatch(removeFromWishlist(token, user.id, productId));
  };

  return (
    isLoggedIn ? (
      <div className="p-8 bg-gray-900 text-white min-h-screen">
        <h2 className="text-3xl font-semibold mb-6">My Wishlist</h2>

        {/* Conditional Rendering for Loading/Error */}
        {loading ? (
          <p>Loading wishlist...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : wishlistItems.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <div className="flex flex-wrap -mx-2">
            {wishlistItems.map((product) => (
              <div key={product._id} className="relative  p-4 rounded-lg shadow-lg">
                <ProductCard
                  id={product._id}
                  name={product.name}
                  price={product.currentPrice}
                  originalPrice={product.MRP}
                  discount={product.discount}
                  imageUrl={`http://localhost:3000/public/images/${product.imageUrl?.[0] || 'default-product.jpg'}`}
                  stock={product.stock}
                  isWishlisted={true} // Always wishlisted since it's in the wishlist
                  handleRemoveWish={() => handleDelete(product._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    ) : (
      <div className="text-center p-20 text-white">
        <p>Please log in to view your wishlist.</p>
      </div>
    )
  );
};

export default WishlistPage;
