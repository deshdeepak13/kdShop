import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const Search = () => {
  const [products, setProducts] = useState([]); // Products fetched from the backend
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("none");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch products from the backend
  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== "all") queryParams.append("category", selectedCategory);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);

      const response = await axios.get(`http://localhost:3000/api/v1/products?${queryParams.toString()}`);
      setProducts(response.data);
      console.log(response.data[0]);
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [maxPrice, selectedCategory]);

  // Filter and sort products locally based on search term
  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
    <div className="flex ">
      {/* Aside Tag (Search) */}
      <aside className="w-1/4 p-4 border-r border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Search</h2>

        {/* Sort Option */}
        <div className="mb-4">
          <label htmlFor="sort" className="block font-medium mb-2">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full p-2 border"
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
            className="w-full p-2 border"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="home">Home</option>
            {/* Add more categories as needed */}
          </select>
        </div>
      </aside>

      {/* Main Tag (Products) */}
      <main className="w-3/4 p-4">
        <h2 className="text-lg font-semibold mb-4">Products</h2>

        {/* Search Bar */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by product name"
          className="w-full p-2 border mb-4"
        />

        {/* Display Filtered Products */}
        {isLoading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  name={product.name}
                  price={product.currentPrice}
                  originalPrice={product.MRP}
                  discount={product.discount}
                  imageUrl={`http://localhost:3000/public/images/${product.imageUrl?.[0] || 'default-product.jpg'}`}  //product.imageUrl
                />
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
