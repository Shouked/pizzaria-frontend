import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Menu = ({ isMenuOpen, setIsMenuOpen, addToCart, cart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('TODAS');
  const [error, setError] = useState(''); // Adicionar estado para erro

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/products');
        console.log('Produtos recebidos:', response.data);
        setProducts(response.data);
        setFilteredProducts(response.data);
        setError(''); // Limpar erro em caso de sucesso
      } catch (err) {
        console.error('Erro ao buscar produtos:', err.response?.data || err.message);
        setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
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
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
              {product.image && product.image !== '' ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-gray-500">Sem imagem</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-[#e63946]">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.description}</p>
              <p className="text-base font-bold mt-2">R$ {product.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 w-full bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm flex items-center justify-center"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Adicionar ao Carrinho
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
