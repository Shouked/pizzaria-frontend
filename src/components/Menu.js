import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const Menu = ({ cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const categoryRefs = useRef({});
  const scrollContainerRef = useRef(null);

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
        setSelectedCategory(Object.keys(grouped)[0] || '');
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
      const offset = 130;
      const scrollTop = window.scrollY + offset;

      let currentCategory = selectedCategory;

      for (const [category, ref] of Object.entries(categoryRefs.current)) {
        if (ref && ref.offsetTop <= scrollTop) {
          currentCategory = category;
        }
      }

      setSelectedCategory(currentCategory);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [groupedProducts]);

  const scrollToCategory = (category) => {
    const ref = categoryRefs.current[category];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollCategoryBar = (category) => {
    const container = scrollContainerRef.current;
    const button = container.querySelector(`[data-category="${category}"]`);
    if (container && button) {
      const scrollAmount = button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2;
      container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    scrollToCategory(category);
    scrollCategoryBar(category);
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
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-xl font-bold text-center text-[#e63946] mb-2">Cardápio</h2>

      <div
        ref={scrollContainerRef}
        className="sticky top-[60px] z-40 bg-[#f1faee] py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300"
      >
        <div className="flex gap-2 w-max px-2">
          {Object.keys(groupedProducts).map((category) => (
            <button
              key={category}
              data-category={category}
              className={`px-4 py-1 rounded-full border border-[#e63946] whitespace-nowrap capitalize text-sm transition ${
                selectedCategory === category
                  ? 'bg-[#e63946] text-white font-bold'
                  : 'bg-white text-[#e63946]'
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="py-4 space-y-8">
        {Object.entries(groupedProducts).map(([category, items]) => (
          <div key={category} ref={(el) => (categoryRefs.current[category] = el)}>
            <h3 className="text-lg font-bold capitalize mb-4">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
                >
                  <h4 className="text-md font-bold mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-sm font-semibold text-[#e63946] mb-2">
                    R$ {product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-[#e63946] text-white px-4 py-1 rounded hover:bg-red-600 transition text-sm"
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