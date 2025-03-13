import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = ({ isMenuOpen, setIsMenuOpen, addToCart, cart }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // Garantir que o estado esteja definido aqui

  useEffect(() => {
    axios.get("https://pizzaria-backend-e254.onrender.com/api/products")
      .then(response => setProducts(response.data))
      .catch(error => console.log(error));
  }, []);

  const categories = [...new Set(products.map(p => p.category))];

  const scrollToCategory = (category) => {
    setSelectedCategory(category);
    setIsMenuOpen(false);
    const element = document.getElementById(category || 'all-products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setSelectedProduct(null);
    // Simulação de notificação
    alert(`${product.name} adicionado à sacola!`);
  };

  return (
    <div className="container mx-auto p-2 md:p-4 bg-[#f1faee] min-h-screen">
      {/* Barra de Categorias Deslizável */}
      <div className="w-full overflow-x-auto whitespace-nowrap pb-2 mb-4 bg-white shadow-md sticky top-12 z-10">
        <button
          onClick={() => scrollToCategory(null)}
          className={`inline-block px-3 py-1 mx-1 rounded-full text-sm font-semibold ${
            !selectedCategory ? 'bg-[#e63946] text-white' : 'bg-gray-200 hover:bg-gray-300'
          } transition`}
        >
          Todas
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => scrollToCategory(category)}
            className={`inline-block px-3 py-1 mx-1 rounded-full text-sm font-semibold ${
              selectedCategory === category ? 'bg-[#e63946] text-white' : 'bg-gray-200 hover:bg-gray-300'
            } transition`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Cardápio */}
      <div id="all-products" className="space-y-4">
        {categories.map(category => (
          <div key={category} id={category} className="scroll-mt-16">
            <h2 className="text-xl md:text-2xl font-bold text-[#e63946] mb-3 md:mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {products
                .filter(product => product.category === category)
                .map(product => (
                  <div
                    key={product._id}
                    className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-1">{product.description}</p>
                    <p className="text-green-600 font-bold text-sm md:text-base mb-2">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full bg-[#e63946] text-white py-1 px-2 rounded-full hover:bg-red-700 transition text-xs md:text-sm"
                    >
                      Adicionar
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-4 rounded-lg w-11/12 md:w-1/3">
            <h2 className="text-xl font-bold text-[#e63946] mb-3">{selectedProduct.name}</h2>
            <p className="text-gray-600 mb-3">{selectedProduct.description}</p>
            <p className="text-green-600 font-bold text-base mb-3">R$ {selectedProduct.price.toFixed(2)}</p>
            <button
              onClick={() => handleAddToCart(selectedProduct)}
              className="w-full bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition"
            >
              Adicionar ao Pedido
            </button>
            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition mt-2"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Botão Voltar ao Topo */}
      <button
        onClick={() => scrollToCategory(null)}
        className="fixed bottom-16 right-4 bg-[#e63946] text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition z-10 md:bottom-4"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default Menu;