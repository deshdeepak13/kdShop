import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import ProductCard from "./ProductCard";
import axios from "axios";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const wishlist = useSelector((state) => state.wishlist.wishlistItems || []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/products`
        );
        setProducts(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Skeleton loader array
  const skeletonItems = Array(8).fill(0);

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Banner Section */}
      <section className="banner-container px-4 md:px-8 lg:px-16 xl:px-24">
        <Carousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          interval={3000}
          transitionTime={500}
          swipeable={true}
          emulateTouch={true}
          ariaLabel="Product carousel"
          className="rounded-xl overflow-hidden shadow-xl"
        >
          {[1, 2, 3].map((slide) => (
            <div key={slide} className="carousel-slide">
              <img
                src={`slide${slide}.webp`}
                alt={`Featured product ${slide}`}
                className="object-cover w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]"
                loading="lazy"
              />
              <div className="legend bg-gray-900/80 p-4 rounded-lg">
                <h2 className="text-xl md:text-3xl font-bold mb-2">New Collection 2024</h2>
                <p className="text-gray-300 md:text-lg">Up to 50% off selected items</p>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Product Section */}
      <section className="product-section px-4 md:px-8 lg:px-16 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Featured Products</h2>
        
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex gap-5 justify-center sm:justify-start flex-wrap">
            {isLoading ? (
              skeletonItems.map((_, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-4">
                  <Skeleton height={200} className="mb-4 rounded-lg" />
                  <Skeleton count={3} className="mb-2" />
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product) => {
                const isWishlisted = wishlist.some(
                  (item) => item.id === product._id
                );
                const imageUrl = product.imageUrl?.[0] 
                  ? product.imageUrl[0].startsWith('http') 
                    ? product.imageUrl[0]
                    : `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/public/images/${product.imageUrl[0]}`
                  : "/default-product.jpg";

                return (
                  <ProductCard 
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.currentPrice}
                    originalPrice={product.MRP}
                    discount={product.discount}
                    imageUrl={imageUrl}
                    stock={product.stock}
                    isWishlisted={isWishlisted}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400 text-lg">No products found</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;