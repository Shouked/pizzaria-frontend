// src/components/Menu.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Menu = ({ cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`https://pizzaria-backend-e254.onrender.com/api/products/${tenantId}/products`);
        setProducts(res.data);
        const uniqueCategories = [...new Set(res.data.map(p => p.category))];
        setCategories(uniqueCategories);
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      }
    };

    if (tenantId) {
      fetchProducts();
    }
  }, [tenantId]);

  useEffect(() => {
    const filtered = selectedCategory
      ? products.filter(product => product.category === selectedCategory)
      : products;
    setFilteredProducts(filtered);
  }, [products, selectedCategory]);

  const handleAddToCart = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoginOpen(true);
      return;
    }

    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#e63946] mb-4">Cardápio</h2>

      <div className="flex overflow-x-auto space-x-4 mb-4">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border ${cat === selectedCategory ? 'bg-[#e63946] text-white' : 'bg-white text-[#e63946] border-[#e63946]'}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {filteredProducts.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
            <img src={product.image} alt={product.name} className="h-40 object-cover rounded-md mb-2" />
            <h3 className="text-lg font-semibold text-[#1d3557]">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            <span className="text-[#e63946] font-bold mb-2">R$ {product.price.toFixed(2)}</span>
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-[#e63946] text-white px-4 py-2 rounded hover:bg-red-600 mt-auto"
            >
              Adicionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;