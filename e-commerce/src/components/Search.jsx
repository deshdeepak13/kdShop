import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";

const Search = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("none");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const wishlist = useSelector((state) => state.wishlist.wishlistItems || []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== "all") queryParams.append("category", selectedCategory);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);

      const response = await axios.get(
        `http://localhost:3000/api/v1/products?${queryParams.toString()}`
      );
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [maxPrice, selectedCategory]);

  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "priceLowHigh") {
        return a.currentPrice - b.currentPrice;
      } else if (sortOption === "priceHighLow") {
        return b.currentPrice - a.currentPrice;
      } else if (sortOption === "quantity") {
        return b.stock - a.stock;
      } else {
        return 0;
      }
    });

  return (
    <div className="flex">
      {/* Aside (Filters) */}
      <aside className="w-full md:w-1/4 p-6 bg-gray-900 shadow-lg rounded-lg border border-gray-700 overflow-hidden">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Filters</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <label htmlFor="search" className="block font-medium mb-2 text-gray-300">
            Search:
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name"
            className="w-full p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Sort Option */}
        <div className="mb-6">
          <label htmlFor="sort" className="block font-medium mb-2 text-gray-300">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          >
            <option value="none">None</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="quantity">Quantity</option>
          </select>
        </div>

        {/* Price Slider */}
        <div className="mb-6">
          <label htmlFor="priceRange" className="block font-medium mb-2 text-gray-300">
            Max Price: ₹{maxPrice}
          </label>
          <input
            type="range"
            id="priceRange"
            min="100"
            max="100000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-gray-800 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Category Selector */}
        <div>
          <label htmlFor="category" className="block font-medium mb-2 text-gray-300">
            Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>Loading categories...</option>
            )}
          </select>
        </div>
      </aside>

      {/* Main (Product List) */}
      <main className="w-full md:w-3/4 p-4 overflow-y-auto h-[100vh] scrollbar-none bg-gray-800">
        <h2 className="text-2xl font-semibold mb-6 text-gray-100">Products</h2>

        {/* Display Filtered Products */}
        {isLoading ? (
          <p className="text-center text-gray-400">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const isWishlisted = wishlist.some((item) => item.id === product._id);
                return (
                  <ProductCard
                    key={product._id}
                    name={product.name}
                    price={product.currentPrice}
                    originalPrice={product.MRP}
                    discount={product.discount}
                    imageUrl={`http://localhost:3000/public/images/${product.imageUrl?.[0] || "default-product.jpg"}`}
                    stock={product.stock}
                    isWishlisted={isWishlisted}
                  />
                );
              })
            ) : (
              <p className="text-center text-gray-400">No products found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
