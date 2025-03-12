import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = ({ isMenuOpen, setIsMenuOpen }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    axios.get("https://pizzaria-backend-e254.onrender.com/api/products")
      .then(response => setProducts(response.data))
      .catch(error => console.log(error));
  }, []);

  // Agrupar produtos por categoria
  const categories = [...new Set(products.map(p => p.category))];
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div className="container mx-auto p-4 md:p-6 bg-[#f1faee] flex flex-col md:flex-row min-h-screen">
      {/* Menu Lateral (Mobile Dropdown / Desktop Fixo) */}
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

      {/* Cardápio */}
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
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm md:text-base mb-2 md:mb-3">{product.description}</p>
                      <p className="text-green-600 font-bold text-base md:text-lg mb-3 md:mb-4">
                        R$ {product.price.toFixed(2)}
                      </p>
                      <a
                        href={`https://wa.me/5511999999999?text=Quero pedir: ${product.name}`}
                        target="_blank"
                        className="bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition inline-block text-sm md:text-base"
                      >
                        Pedir
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Menu;