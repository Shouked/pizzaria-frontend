import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(https://pizzaria-backend-e254.onrender.com/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.log(error));
  }, []);

  // Agrupar produtos por categoria
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="container mx-auto p-6 bg-[#f1faee]">
      {categories.map(category => (
        <div key={category} className="mb-8">
          <h2 className="text-3xl font-bold text-[#e63946] mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products
              .filter(product => product.category === category)
              .map(product => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <p className="text-green-600 font-bold mt-2">R$ {product.price.toFixed(2)}</p>
                  <a
                    href={`https://wa.me/5511940705013?text=Quero pedir: ${product.name}`}
                    target="_blank"
                    className="mt-4 bg-[#e63946] text-white py-2 px-4 rounded hover:bg-red-700 inline-block"
                  >
                    Pedir
                  </a>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
