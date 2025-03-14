import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Menu = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        setError('Erro ao carregar produtos. Tente novamente.');
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === product._id ? { ...item, quantity: (item.quantity || 0) + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const filteredProducts = selectedCategory === 'TODAS'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="container mx-auto p-4">
      {/* Barra Horizontal Deslizável de Categorias */}
      <div className="flex overflow-x-auto space-x-4 pb-4 whitespace-nowrap">
        {['TODAS', 'PIZZAS', 'BEBIDAS', 'SOBREMESAS'].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm ${selectedCategory === category ? 'bg-[#e63946] text-white' : 'bg-gray-200 text-gray-800'} hover:bg-[#e63946] hover:text-white transition`}
          >
            {category}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {products.length === 0 && !error ? (
        <p className="text-center text-gray-600">Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-[#e63946]">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-lg font-bold mt-2">R$ {product.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-4 bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition w-full"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
