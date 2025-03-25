import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const Menu = ({ cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
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
        setActiveCategory(Object.keys(grouped)[0] || '');
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    };

    if (tenantId) {
      fetchProducts();
    }
  }, [tenantId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const category = entry.target.getAttribute('data-category');
            setActiveCategory(category);
          }
        });
      },
      { rootMargin: '-60px 0px -80% 0px', threshold: 0 }
    );

    Object.keys(categoryRefs.current).forEach(category => {
      const ref = categoryRefs.current[category];
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [groupedProducts]);

  const handleCategoryClick = (category) => {
    const ref = categoryRefs.current[category];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const addToCart = (product) => {
    const itemIndex = cart.findIndex((item) => item._id === product._id);
    const updatedCart = [...cart];

    if (itemIndex >= 0) {
      updatedCart[itemIndex].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);

    // Feedback visual
    const audio = new Audio('/add-to-cart.mp3'); // opcional, se quiser som
    audio.play().catch(() => {});
  };

  return (
    <div className="p-4 pt-2 max-w-4xl mx-auto">
      {/* BARRA DE CATEGORIAS FIXA */}
      <div className="sticky top-0 z-40 bg-[#f1faee] py-2 overflow-x-auto whitespace-nowrap border-b border-gray-200">
        <div className="flex space-x-2 px-2 min-w-full">
          {Object.keys(groupedProducts).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-1 rounded-full text-sm border transition 
                ${activeCategory === category ? 'bg-[#e63946] text-white' : 'bg-white text-[#e63946] border-[#e63946]'}`}
            >
              {capitalize(category)}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUTOS AGRUPADOS */}
      {Object.entries(groupedProducts).map(([category, items]) => (
        <div
          key={category}
          ref={(el) => (categoryRefs.current[category] = el)}
          data-category={category}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-[#1d3557] mb-4 mt-6">{capitalize(category)}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between hover:shadow-md"
              >
                <h4 className="text-md font-bold">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-sm font-semibold text-[#e63946] mt-2">R$ {product.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 bg-[#e63946] text-white px-4 py-1 rounded hover:bg-red-600 text-sm transition"
                >
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Nenhum produto */}
      {Object.keys(groupedProducts).length === 0 && (
        <p className="text-center text-gray-500 mt-8">Nenhum produto disponível no momento.</p>
      )}
    </div>
  );
};

export default Menu;