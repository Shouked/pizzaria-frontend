import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const Menu = ({ cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const containerRef = useRef(null);
  const categoryRefs = useRef({});
  const categoryBarRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/${tenantId}/products`);
        const fetchedProducts = res.data;

        const grouped = fetchedProducts.reduce((acc, product) => {
          const category = product.category || 'Outros';
          const formatted = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
          if (!acc[formatted]) acc[formatted] = [];
          acc[formatted].push(product);
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

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const headerHeight = 144;
    const barOffset = 56;
    for (const [category, ref] of Object.entries(categoryRefs.current)) {
      if (ref && ref.offsetTop - headerHeight - barOffset <= scrollY) {
        setActiveCategory(category);
        scrollCategoryIntoView(category);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollCategoryIntoView = (category) => {
    const button = document.querySelector(`#category-btn-${category}`);
    if (button && categoryBarRef.current) {
      const bar = categoryBarRef.current;
      const barRect = bar.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const offset = buttonRect.left - barRect.left - bar.offsetWidth / 2 + button.offsetWidth / 2;
      bar.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollToCategory = (category) => {
    const ref = categoryRefs.current[category];
    if (ref) {
      window.scrollTo({ top: ref.offsetTop - 144, behavior: 'smooth' });
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
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto">
      <div className="sticky top-0 z-40 bg-white shadow-sm overflow-x-auto no-scrollbar border-b border-gray-200"
           ref={categoryBarRef}>
        <div className="flex whitespace-nowrap px-2">
          {Object.keys(groupedProducts).map((category) => (
            <button
              key={category}
              id={`category-btn-${category}`}
              onClick={() => scrollToCategory(category)}
              className={`px-3 py-2 text-sm font-medium capitalize border-b-2 transition-all duration-200 ${
                activeCategory === category ? 'text-[#e63946] border-[#e63946]' : 'text-gray-500 border-transparent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {Object.entries(groupedProducts).map(([category, items]) => (
        <div
          key={category}
          ref={(el) => (categoryRefs.current[category] = el)}
          className="px-4 py-6"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-3 capitalize">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            {items.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
              >
                <h4 className="text-md font-bold mb-1">{product.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <p className="text-sm font-semibold text-[#e63946] mb-2">R$ {product.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-[#e63946] text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
