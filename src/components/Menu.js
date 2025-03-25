import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const Menu = ({ cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const categoryRefs = useRef({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/${tenantId}/products`);
        const fetchedProducts = res.data;

        const grouped = fetchedProducts.reduce((acc, product) => {
          const category = product.category || 'Outros';
          if (!acc[category]) acc[category] = [];
          acc[category].push(product);
          return acc;
        }, {});

        setGroupedProducts(grouped);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    };

    if (tenantId) {
      fetchProducts();
    }
  }, [tenantId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY + 130; // ajuste para compensar a barra fixa
      const entries = Object.entries(categoryRefs.current);
      for (let i = 0; i < entries.length; i++) {
        const [category, ref] = entries[i];
        if (ref?.offsetTop <= scrollTop) {
          setActiveCategory(category);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCategory = (category) => {
    const section = categoryRefs.current[category];
    if (section) {
      window.scrollTo({ top: section.offsetTop - 120, behavior: 'smooth' });
    }
  };

  const addToCart = (product) => {
    const itemIndex = cart.findIndex((item) => item._id === product._id);
    let updatedCart = [...cart];

    if (itemIndex >= 0) {
      updatedCart[itemIndex].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
  };

  return (
    <div className="pb-24">
      {/* Barra Fixa de Categorias */}
      <div className="sticky top-[5.5rem] z-40 bg-[#f1faee] overflow-x-auto whitespace-nowrap border-b border-gray-300 shadow-sm">
        <div className="flex space-x-2 px-4 py-2">
          {Object.keys(groupedProducts).map((category) => (
            <button
              key={category}
              onClick={() => scrollToCategory(category)}
              className={`px-4 py-1 rounded-full border ${
                activeCategory === category
                  ? 'bg-[#e63946] text-white border-[#e63946]'
                  : 'bg-white text-[#e63946] border-[#e63946]'
              } transition whitespace-nowrap text-sm font-semibold`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-center text-[#e63946] mb-4">Cardápio</h2>

        {Object.keys(groupedProducts).length === 0 && (
          <p className="text-center text-gray-500">Nenhum produto disponível no momento.</p>
        )}

        {Object.entries(groupedProducts).map(([category, items]) => (
          <div
            key={category}
            ref={(el) => (categoryRefs.current[category] = el)}
            className="mb-6 scroll-mt-28"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
                >
                  <img
                    src={product.image || product.imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <h4 className="text-md font-bold">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-sm font-semibold text-[#e63946]">R$ {product.price.toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-2 bg-[#e63946] text-white px-4 py-1 rounded hover:bg-red-600 transition text-sm"
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
