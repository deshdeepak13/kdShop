import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "../SnackbarProvider";

const ProductManagement = () => {
  const addSnackbar = useSnackbar();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    images: [],
    description: "",
    MRP: "",
    discount: "",
    stock: "",
    category: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/v1/admin/products`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );
      setProducts(response.data);
      console.log("Products fetched successfully:", response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const editProduct = (product) => {
    setSelectedProduct(product);
    setUpdatedProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewProduct((prev) => ({ ...prev, images: [...e.target.files] }));
  };

  const updateProduct = async () => {
    if (
      !updatedProduct.name ||
      !updatedProduct.stock ||
      !updatedProduct.description ||
      !updatedProduct.discount ||
      !updatedProduct.MRP ||
      !updatedProduct.category
    ) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/v1/admin/product/${selectedProduct._id}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );

      if (response.status === 200) {
        setProducts(
          products.map((product) =>
            product._id === selectedProduct._id
              ? { ...updatedProduct, _id: selectedProduct._id }
              : product
          )
        );
        setIsEditModalOpen(false);
        setSelectedProduct(null);
        addSnackbar({ message: `Product updated!`, type: "success" });
      }
    } catch (err) {
      console.error(err);
      addSnackbar({ message: `Failed to update product!`, type: "error" });
      setError("Failed to update product");
    }
  };

  const addProduct = async () => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    newProduct.images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("description", newProduct.description);
    formData.append("MRP", newProduct.MRP);
    formData.append("discount", newProduct.discount);
    formData.append("stock", newProduct.stock);
    formData.append("category", newProduct.category);

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/v1/admin/products`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        setProducts([...products, response.data]);
        setIsAddModalOpen(false);
        setNewProduct({
          name: "",
          images: [],
          description: "",
          MRP: "",
          discount: "",
          stock: "",
          category: "",
        });
        addSnackbar({
          message: `Product added to inventory!`,
          type: "success",
        });
      }
    } catch (err) {
      console.error(err);
      addSnackbar({ message: `Failed to add product!`, type: "success" });
      setError("Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/v1/admin/product/${id}`
      );
      setProducts(products.filter((product) => product._id !== id));
      addSnackbar({
        message: `Product removed from inventory!`,
        type: "deleted",
      });
    } catch (err) {
      // console.log(err)
      addSnackbar({ message: `Failed to delted product!`, type: "error" });
      setError("Failed to delete product");
    }
  };

  // Filters and Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="text-white text-center mt-20 text-xl">
        Loading Inventory...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-20 text-xl">{error}</div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Product Management</h2>
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-lg"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products by name or category..."
          className="w-full md:w-1/3 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-xl border border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-750 text-gray-400 border-b border-gray-700">
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Image
              </th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Name
              </th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Stock
              </th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">MRP</th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Price
              </th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Category
              </th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {product.imageUrl?.slice(0, 3).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={product.name}
                          className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        product.stock > 10
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 line-through">
                    ₹{product.MRP}
                  </td>
                  <td className="px-6 py-4 font-bold text-green-400">
                    ₹{Math.round(product.MRP * (1 - product.discount / 100))}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-xs">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex space-x-3">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
                      onClick={() => editProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add Product</h3>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addProduct();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold mb-2"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleAddInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleAddInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="MRP"
                  className="block text-sm font-semibold mb-2"
                >
                  MRP
                </label>
                <input
                  type="number"
                  id="MRP"
                  name="MRP"
                  value={newProduct.MRP}
                  onChange={handleAddInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="discount"
                  className="block text-sm font-semibold mb-2"
                >
                  Discount
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={newProduct.discount}
                  onChange={handleAddInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="stock"
                  className="block text-sm font-semibold mb-2"
                >
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleAddInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold mb-2"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleAddInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="images"
                  className="block text-sm font-semibold mb-2"
                >
                  Upload Images
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProduct();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold mb-2"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={updatedProduct.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={updatedProduct.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="MRP"
                  className="block text-sm font-semibold mb-2"
                >
                  MRP
                </label>
                <input
                  type="number"
                  id="MRP"
                  name="MRP"
                  value={updatedProduct.MRP}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="discount"
                  className="block text-sm font-semibold mb-2"
                >
                  Discount
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={updatedProduct.discount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="stock"
                  className="block text-sm font-semibold mb-2"
                >
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={updatedProduct.stock}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold mb-2"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={updatedProduct.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
