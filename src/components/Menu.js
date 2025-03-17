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
        const sortedProducts = response.data.sort((a, b) => {
          const categoryOrder = { PIZZA: 1, BEBIDAS: 2, SOBREMESA: 3 };
          return (categoryOrder[a.category] || 4) - (categoryOrder[b.category] || 4);
        });
        console.log('Produtos carregados:', sortedProducts);
        setProducts(sortedProducts);
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

  const scrollToSection = (sectionId) => {
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        const bannerHeight = document.querySelector('#banner')?.offsetHeight || 100; // Altura do banner (ajuste se necessário)
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: sectionTop - bannerHeight,
          behavior: 'smooth',
        });
      } else {
        console.log(`Seção ${sectionId} não encontrada`);
      }
    }, 100);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex overflow-x-auto space-x-4 pb-4 whitespace-nowrap">
        {['TODAS', 'PIZZA', 'BEBIDAS', 'SOBREMESA'].map(category => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              scrollToSection(category.toLowerCase());
            }}
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
        <>
          <section id="todas" className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Todas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
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
          </section>
          <section id="pizza" className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Pizza</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.category === 'PIZZA').map(product => (
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
          </section>
          <section id="bebidas" className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Bebidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.category === 'BEBIDAS').map(product => (
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
          </section>
          <section id="sobremesa" className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Sobremesa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.category === 'SOBREMESA').map(product => (
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
          </section>
        </>
      )}
    </div>
  );
};

export default Menu;
