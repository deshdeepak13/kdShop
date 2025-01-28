import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import ProductCard from "./ProductCard";
import axios from "axios";
import { useSelector } from "react-redux";

const Home = () => {
  const [products, setProducts] = useState([]);
  const wishlist = useSelector((state) => state.wishlist.wishlistItems || []);

  useEffect(() => {
    // Fetch product data from backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/products");
        setProducts(response.data); // Assuming the response has the array directly
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      {/* Banner Section */}
      <section className="banners bg-gray-900">
        <Carousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          interval={1500}
        >
          <div>
            <img src="slide1.webp" alt="Image 1" className="rounded-lg shadow-lg" />
          </div>
          <div>
            <img src="slide3.webp" alt="Image 2" className="rounded-lg shadow-lg" />
          </div>
          <div>
            <img src="slide1.webp" alt="Image 3" className="rounded-lg shadow-lg" />
          </div>
        </Carousel>
      </section>

      {/* Product Section */}
      <section className="section1 flex mt-10 gap-5 flex-wrap p-6 bg-gray-800 text-white">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => {
            const isWishlisted = wishlist.some((item) => item.id === product._id);
            return (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.currentPrice}
                originalPrice={product.MRP}
                discount={product.discount}
                imageUrl={`http://localhost:3000/public/images/${
                  product.imageUrl?.[0] || "default-product.jpg"
                }`}
                stock={product.stock}
                isWishlisted={isWishlisted}
              />
            );
          })
        ) : (
          <p className="text-gray-400">No products found.</p>
        )}
      </section>
    </>
  );
};

export default Home;
