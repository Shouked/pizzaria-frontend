import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = ({ isMenuOpen, setIsMenuOpen, addToCart, cart }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios.get("https://pizzaria-backend-e254.onrender.com/api/products")
      .then(response => setProducts(response.data))
      .catch(error => console.log(error));
  }, []);

  const categories = [...new Set(products.map(p => p.category))];
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  const handleAddToCart = (product) => {
    addToCart(product);
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 bg-[#f1faee] flex flex-col md:flex-row min-h-screen">
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:block md:w-1/5 md:pr-6 md:fixed md:h-screen md:overflow-y-auto bg-[#f1faee] z-10`}
      >
        <h2 className="text-2xl font-bold text-[#e63946] mb-4 md:sticky md:top-0 md:py-2">Categorias</h2>
        <ul className="space-y-2 md:space-y-3">
          <li>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setIsMenuOpen(false);
              }}
              className={`w-full text-left p-3 rounded-lg font-semibold ${
                !selectedCategory ? 'bg-[#e63946] text-white' : 'bg-gray-200 hover:bg-gray-300'
              } transition`}
            >
              Todas
            </button>
          </li>
          {categories.map(category => (
            <li key={category}>
              <button
                onClick={() => {
                  setSelectedCategory(category);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-lg font-semibold ${
                  selectedCategory === category ? 'bg-[#e63946] text-white' : 'bg-gray-200 hover:bg-gray-300'
                } transition`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full md:w-4/5 md:ml-[20%] mt-4 md:mt-0">
        {categories.map(category => (
          (!selectedCategory || selectedCategory === category) && (
            <div key={category} className="mb-8 md:mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[#e63946] mb-4 md:mb-6">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts
                  .filter(product => product.category === category)
                  .map(product => (
                    <div
                      key={product._id}
                      className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      <img
                        src={product.image || 'https://via.placeholder.com/150'}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-t-xl mb-3"
                      />
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm md:text-base mb-2 md:mb-3">{product.description}</p>
                      <p className="text-green-600 font-bold text-base md:text-lg mb-3 md:mb-4">
                        R$ {product.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition inline-block text-sm md:text-base"
                      >
                        Adicionar
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
            <h2 className="text-2xl font-bold text-[#e63946] mb-4">{selectedProduct.name}</h2>
            <img
              src={selectedProduct.image || 'https://via.placeholder.com/150'}
              alt={selectedProduct.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
            <p className="text-green-600 font-bold text-lg mb-4">R$ {selectedProduct.price.toFixed(2)}</p>
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
    </div>
  );
};

export default Menu;