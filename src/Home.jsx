// Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: 0,
    price: 0.0,
  });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all products
    const storedToken = localStorage.getItem('accessToken');
    axios.get('http://localhost:5000/products', {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
      .then(response => setProducts(response.data))
      .catch(error => alert('Error fetching products:', error));

    // Check if the user is admin
    if (storedToken) {
      axios.get('http://localhost:5000/user', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(response => setIsAdmin(response.data.role === 'admin'))
        .catch(error => alert('Error checking user role:', error));
    }
  }, []);

  const handleAddProduct = () => {
    // Implement logic for adding a new product
    const storedToken = localStorage.getItem('accessToken');
  
    axios.post('http://localhost:5000/products', newProduct, {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
      .then(response => {
        setProducts([...products, response.data.product]);
        setNewProduct({
          name: '',
          quantity: 0,
          price: 0.0,
        });
      })
      .catch(error => console.error('Error adding product:', error));
  };

  const handleUpdateProduct = () => {
    // Implement logic for updating a product
    const storedToken = localStorage.getItem('accessToken');
    if (selectedProductId) {
      axios.put(`http://localhost:5000/products/${selectedProductId}`, newProduct,{
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(response => {
          const updatedProducts = products.map(product =>
            product.id === selectedProductId ? response.data.product : product
          );
          setProducts(updatedProducts);
          alert('Product updated successfully:', response.data);
          setNewProduct({
            name: '',
            quantity: 0,
            price: 0.0,
          });
          setSelectedProductId(null);
        })
        .catch(error => console.error('Error updating product:', error));
    }
  };

  const handleDeleteProduct = (productId) => {
    // Implement logic for deleting a product
    const storedToken = localStorage.getItem('accessToken');
    axios.delete(`http://localhost:5000/products/${productId}`,{
        headers: { Authorization: `Bearer ${storedToken}` }
    })
      .then(() => {
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
        alert('Product deleted successfully');
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  const handleEditProduct = (product) => {
    // Set the product details to the form for editing
    setNewProduct({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    });
    setSelectedProductId(product.id);
  };

  const handleCancelEdit = () => {
    // Clear the form and cancel editing
    setNewProduct({
      name: '',
      quantity: 0,
      price: 0.0,
    });
    setSelectedProductId(null);
  };

  const handleLogout = () => {
    // Clear tokens from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.length > 0 ? products.map(product => (
          <li key={product.id}>
            {product.name} - Quantity: {product.quantity} - Price: ${product.price}
            {isAdmin && (
              <div>
                {/* Admin-only buttons */}
                <button onClick={() => handleEditProduct(product)}>Edit</button>
                <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              </div>
            )}
          </li>
        )):null}
      </ul>

      {isAdmin && (
        <div>
          {/* Admin-only form */}
          <h3>{selectedProductId ? 'Edit Product' : 'Add New Product'}</h3>
          <form>
            <label>
              Name:
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.valueAsNumber })}
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.valueAsNumber })}
              />
            </label>
            <button type="button" onClick={selectedProductId ? handleUpdateProduct : handleAddProduct}>
              {selectedProductId ? 'Update Product' : 'Add Product'}
            </button>
            {selectedProductId && (
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      {/* Logout button */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
