import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import {
  FiFilter,
  FiX,
  FiAlertCircle,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Search page component with server-side filtering and pagination.
 */
const Search = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortOption, setSortOption] = useState("none");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const wishlist = useSelector((state) => state.wishlist.wishlistItems || []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/category`
      );
      setCategories(response.data.categories);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== "all")
        queryParams.append("category", selectedCategory);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);
      if (searchTerm) queryParams.append("keyword", searchTerm);
      queryParams.append("page", page);
      queryParams.append("limit", 9); // 8 items per page

      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/v1/products?${queryParams.toString()}`
      );

      // Handle the new response format { products, totalPages, ... }
      if (response.data.products) {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } else {
        // Fallback if backend structure differs (shouldn't happen with our changes)
        setProducts(response.data);
      }
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when filters or page change
  useEffect(() => {
    fetchProducts();
  }, [maxPrice, selectedCategory, searchTerm, page]);

  // Debounce Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Sort logic (Client-side sorting is fine for current page, or can be moved to backend too)
  // Moving sort to backend is best, but for now we sort the fetched page results.
  const sortedProducts = [...products].sort((a, b) => {
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

  useEffect(() => {
    if (isFiltersOpen) {
      document.body.classList.add("filter-open");
    } else {
      document.body.classList.remove("filter-open");
    }
  }, [isFiltersOpen]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  const resetFilters = () => {
    setSearchInput("");
    setSortOption("none");
    setMaxPrice(100000);
    setSelectedCategory("all");
    setPage(1);
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
        } fixed md:relative inset-y-0 left-0 w-2/3 md:w-72 lg:w-80 z-50 bg-gray-900 border-r border-gray-700 transition-transform duration-300 ease-in-out overflow-hidden md:transform-none`}
      >
        <div className="p-4 md:p-6 h-full flex flex-col">
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
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1); // Reset page on filter change
              }}
              className="w-full bg-gray-800 accent-purple-500"
              aria-label="Price range"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-300">
              Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1); // Reset page on filter change
              }}
              className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button Desktop */}
          <button
            onClick={resetFilters}
            className="md:hidden mt-4 py-2 w-full bg-purple-600 hover:bg-purple-500 text-white rounded-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 bg-gray-800 overflow-x-hidden overflow-y-auto h-screen scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Products</h1>
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
          <div className="flex flex-wrap -mx-2 gap-5 justify-center sm:justify-start">
            {sortedProducts.map((product) => {
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
                  imageUrl={`${product.imageUrl?.[0] || "default-product.jpg"}`}
                  stock={product.stock}
                  isWishlisted={isWishlisted}
                />
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedProducts.length === 0 && (
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

        {/* Pagination Controls */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`flex items-center px-4 py-2 rounded-md ${
                page === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-500"
              }`}
            >
              <FiChevronLeft className="mr-1" /> Previous
            </button>
            <span className="flex items-center text-gray-300">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`flex items-center px-4 py-2 rounded-md ${
                page === totalPages
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-500"
              }`}
            >
              Next <FiChevronRight className="ml-1" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
