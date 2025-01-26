import React, { useState, useEffect } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";

const Search = () => {
  const [products, setProducts] = useState([]); // Products fetched from the backend
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("none");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]); // Dynamic categories
  const wishlist = useSelector((state) => state.wishlist.wishlistItems || []);

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/categories");
      setCategories(response.data); // Assuming response.data is an array of categories
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  // Fetch products from the backend
  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== "all") queryParams.append("category", selectedCategory);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);

      const response = await axios.get(`http://localhost:3000/api/v1/products?${queryParams.toString()}`);
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories and products on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [maxPrice, selectedCategory]);

  // Filter and sort products locally based on search term
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
        return 0; // No sorting
      }
    });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Aside Tag (Filters) */}
      <aside className="lg:w-1/4 p-4 border border-gray-200 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {/* Sort Option */}
        <div className="mb-4">
          <label htmlFor="sort" className="block font-medium mb-2">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="none">None</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="quantity">Quantity</option>
          </select>
        </div>

        {/* Price Slider */}
        <div className="mb-4">
          <label htmlFor="priceRange" className="block font-medium mb-2">
            Max Price: ₹{maxPrice}
          </label>
          <input
            type="range"
            id="priceRange"
            min="100"
            max="100000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Category Selector */}
        <div>
          <label htmlFor="category" className="block font-medium mb-2">
            Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded-md"
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

      {/* Main Tag (Products) */}
      <main className="flex-1">
        <h2 className="text-lg font-semibold mb-4">Products</h2>

        {/* Search Bar */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by product name"
          className="w-full p-2 border rounded-md mb-4"
        />

        {/* Display Filtered Products */}
        {isLoading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              <p>No products found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
