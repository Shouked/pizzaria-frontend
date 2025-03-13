import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Menu = ({ isMenuOpen, setIsMenuOpen, addToCart, cart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('TODAS');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/products');
        console.log('Produtos recebidos:', response.data); // Para depuração
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (category === 'TODAS') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category.toUpperCase() === category));
    }
  }, [category, products]);

  return (
    <div className="container mx-auto p-4 bg-[#f1faee] min-h-screen">
      {/* Carrossel de Categorias */}
      <div className="flex overflow-x-auto space-x-2 mb-4 pb-2 scrollbar-hide">
        {['TODAS', 'PIZZA', 'SOBREMESA', 'BEBIDAS'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
              category === cat ? 'bg-[#e63946] text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
              )}
              <h3 className="text-lg font-semibold text-[#e63946]">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.description}</p>
              <p className="text-base font-bold mt-2">R$ {product.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 w-full bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
              >
                Adicionar à Sacola
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Nenhum produto disponível. Adicione produtos no backend.</p>
        )}
      </div>
    </div>
  );
};

export default Menu;