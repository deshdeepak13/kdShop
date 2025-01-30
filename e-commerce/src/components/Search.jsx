import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { FiFilter, FiX, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Search = () => {
  // ... existing state declarations ...
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
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/categories`);
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
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/products?${queryParams.toString()}`
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


  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Add debounce for search input
  const [searchInput, setSearchInput] = useState("");
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchInput("");
    setSortOption("none");
    setMaxPrice(100000);
    setSelectedCategory("all");
  };

  // Responsive grid configuration
  const getGridColumns = () => {
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900">
      {/* Mobile Filters Toggle */}
      <div className="md:hidden p-4 border-b border-gray-700 flex justify-between items-center">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
        >
          <FiFilter className="mr-2" />
          {isFiltersOpen ? "Hide Filters" : "Show Filters"}
        </button>
        <button
          onClick={resetFilters}
          className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
        >
          <FiRefreshCw className="mr-2" />
          Reset
        </button>
      </div>

      {/* Filters Sidebar */}
      <aside
        className={`${
          isFiltersOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-2/3 md:w-72 lg:w-80 overflow-y-auto md:relative h-screen md:h-auto z-20 bg-gray-900 border-r border-gray-700 transition-transform duration-300 ease-in-out sticky`}
      >
        <div className="p-4 md:p-6 overflow-y-auto h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-100">Filters</h2>
            <button
              onClick={() => setIsFiltersOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-300">
              Search:
            </label>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              aria-label="Search products"
            />
          </div>

          {/* Sort Options */}
          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-300">
              Sort by:
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="none">Featured</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="quantity">Availability</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-300">
              Max Price: ₹{formatPrice(maxPrice)}
            </label>
            <input
              type="range"
              min="100"
              max="100000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-gray-800 accent-purple-500"
              aria-label="Price range"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>₹100</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-300">
              Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
              {categories.length === 0 && (
                <option disabled>Loading categories...</option>
              )}
            </select>
          </div>

          {/* Reset Button Desktop */}
          <button
            onClick={resetFilters}
            className="hidden md:block w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 bg-gray-800 overflow-x-hidden overflow-y-auto h-screen scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-100">
            {filteredProducts.length} Products Found
          </h1>
          <div className="text-gray-400 text-sm">
            {selectedCategory !== "all" && `Category: ${selectedCategory}`}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-wrap -mx-2 gap-5">
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                height={300}
                baseColor="#1f2937"
                highlightColor="#374151"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <FiAlertCircle className="inline-block text-4xl text-red-500 mb-4" />
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && (
          <div className="flex flex-wrap -mx-2 gap-5">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.some(
                (item) => item.id === product._id
              );
              return (
                <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.currentPrice}
                originalPrice={product.MRP}
                discount={product.discount}
                imageUrl={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/public/images/${
                  product.imageUrl?.[0] || "default-product.jpg"
                }`}
                stock={product.stock}
                isWishlisted={isWishlisted}
              />
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No products found</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;