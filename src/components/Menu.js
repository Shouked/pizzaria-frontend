import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = () => {
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
    <div className="container mx-auto p-6 bg-[#f1faee] flex">
      {/* Menu Lateral */}
      <div className="w-1/5 pr-6 fixed h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#e63946] mb-4 sticky top-0 bg-[#f1faee] py-2">Categorias</h2>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => setSelectedCategory(null)}
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
                onClick={() => setSelectedCategory(category)}
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
      <div className="w-4/5 ml-[20%]">
        {categories.map(category => (
          (!selectedCategory || selectedCategory === category) && (
            <div key={category} className="mb-10">
              <h2 className="text-3xl font-bold text-[#e63946] mb-6">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredProducts
                  .filter(product => product.category === category)
                  .map(product => (
                    <div
                      key={product._id}
                      className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-3">{product.description}</p>
                      <p className="text-green-600 font-bold text-lg mb-4">R$ {product.price.toFixed(2)}</p>
                      <a
                        href={`https://wa.me/5511999999999?text=Quero pedir: ${product.name}`}
                        target="_blank"
                        className="bg-[#e63946] text-white py-2 px-5 rounded-full hover:bg-red-700 transition inline-block"
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
