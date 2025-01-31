import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from '../SnackbarProvider';

const ProductManagement = () => {
  const addSnackbar = useSnackbar();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: '',
    images: [],
    description: '',
    MRP: '',
    discount: '',
    stock: '',
    category: '',
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admintoken')}`
        }
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
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
    if (!updatedProduct.name || !updatedProduct.stock || !updatedProduct.description || !updatedProduct.discount || !updatedProduct.MRP || !updatedProduct.category) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/product/${selectedProduct._id}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admintoken')}`
        }
      });

      if (response.status === 200) {
        setProducts(products.map((product) => (product._id === selectedProduct._id ? { ...updatedProduct, _id: selectedProduct._id } : product)));
        setIsEditModalOpen(false);
        setSelectedProduct(null);
        addSnackbar({message:`Product updated!`,type:"success"});
      }
    } catch (err) {
      console.error(err);
      addSnackbar({message:`Failed to update product!`,type:"error"});
      setError('Failed to update product');
    }
  };

  const addProduct = async () => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    newProduct.images.forEach((image) => {
      formData.append('images', image);
    });
    formData.append('description', newProduct.description);
    formData.append('MRP', newProduct.MRP);
    formData.append('discount', newProduct.discount);
    formData.append('stock', newProduct.stock);
    formData.append('category', newProduct.category);

    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        setProducts([...products, response.data]);
        setIsAddModalOpen(false);
        setNewProduct({ name: '', images: [], description: '', MRP: '', discount: '', stock: '', category: '' });
        addSnackbar({message:`Product added to inventory!`,type:"success"});
      }
    } catch (err) {
      console.error(err);
      addSnackbar({message:`Failed to add product!`,type:"success"});
      setError('Failed to add product');
    }
  };
  
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/product/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      addSnackbar({message:`Product removed from inventory!`,type:"deleted"});
    } catch (err) { 
      // console.log(err)
      addSnackbar({message:`Failed to delted product!`,type:"error"});
      setError('Failed to delete product');
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => setIsAddModalOpen(true)}
      >
        Add Product
      </button>

      <table className="w-full bg-gray-800 rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Discount</th>
            <th className="px-4 py-2">MRP</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border border-gray-700 px-4 py-2">
                {product.imageUrl?.map((url, index) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/public/images/${url}`}
                    alt={product.name}
                    className="w-20 h-20 object-contain mr-2"
                  />
                ))}
              </td>
              <td className="border border-gray-700 px-4 py-2">{product.name}</td>
              <td className="border border-gray-700 px-4 py-2">{product.stock}</td>
              <td className="border border-gray-700 px-4 py-2">{product.description}</td>
              <td className="border border-gray-700 px-4 py-2">{product.discount}%</td>
              <td className="border border-gray-700 px-4 py-2">{product.MRP}</td>
              <td className="border border-gray-700 px-4 py-2">{product.category}</td>
              <td className="border border-gray-700 px-4 py-2 flex space-x-2">
                <button
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => editProduct(product)}  
                >
                  Edit
                </button>
                <button
                  className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
          <label htmlFor="name" className="block text-sm font-semibold mb-2">
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
          <label htmlFor="description" className="block text-sm font-semibold mb-2">
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
          <label htmlFor="MRP" className="block text-sm font-semibold mb-2">
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
          <label htmlFor="discount" className="block text-sm font-semibold mb-2">
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
          <label htmlFor="stock" className="block text-sm font-semibold mb-2">
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
          <label htmlFor="category" className="block text-sm font-semibold mb-2">
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
          <label htmlFor="images" className="block text-sm font-semibold mb-2">
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
          <label htmlFor="name" className="block text-sm font-semibold mb-2">
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
          <label htmlFor="description" className="block text-sm font-semibold mb-2">
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
          <label htmlFor="MRP" className="block text-sm font-semibold mb-2">
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
          <label htmlFor="discount" className="block text-sm font-semibold mb-2">
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
          <label htmlFor="stock" className="block text-sm font-semibold mb-2">
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
          <label htmlFor="category" className="block text-sm font-semibold mb-2">
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
