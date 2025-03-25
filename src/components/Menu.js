import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const Menu = ({ cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);

  const categoryRefs = useRef({});
  const sectionRefs = useRef({});
  const menuContainerRef = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/${tenantId}/products`);
        const fetchedProducts = res.data;

        const grouped = fetchedProducts.reduce((acc, product) => {
          const category = product.category || 'Outros';
          const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
          if (!acc[formattedCategory]) acc[formattedCategory] = [];
          acc[formattedCategory].push(product);
          return acc;
        }, {});

        setGroupedProducts(grouped);
        setProducts(fetchedProducts);
        setActiveCategory(Object.keys(grouped)[0]);
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
      const scrollPosition = window.scrollY + 130;

      let current = activeCategory;
      Object.entries(sectionRefs.current).forEach(([category, ref]) => {
        if (ref && ref.offsetTop <= scrollPosition) {
          current = category;
        }
      });

      if (current !== activeCategory) {
        setActiveCategory(current);

        if (categoryRefs.current[current]) {
          categoryRefs.current[current].scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory]);

  const scrollToCategory = (category) => {
    const ref = sectionRefs.current[category];
    if (ref) {
      window.scrollTo({
        top: ref.offsetTop - 110,
        behavior: 'smooth'
      });
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
    <div ref={menuContainerRef} className="relative pt-4 pb-20 max-w-4xl mx-auto px-2">
      <div className="sticky top-[140px] z-40 bg-[#f1faee] pb-2">
        <div className="flex overflow-x-auto space-x-2 px-2">
          {Object.keys(groupedProducts).map((category) => (
            <button
              key={category}
              ref={(el) => (categoryRefs.current[category] = el)}
              onClick={() => scrollToCategory(category)}
              className={`px-4 py-1 whitespace-nowrap rounded-full border text-sm font-semibold capitalize ${
                activeCategory === category
                  ? 'bg-[#e63946] text-white border-[#e63946]'
                  : 'bg-white text-[#e63946] border-[#e63946]'
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
          ref={(el) => (sectionRefs.current[category] = el)}
          className="mb-6"
        >
          <h3 className="text-lg font-bold text-gray-700 mb-2 capitalize">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
              >
                <h4 className="text-md font-bold">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-sm font-semibold text-[#e63946]">
                  R$ {product.price.toFixed(2)}
                </p>
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
  );
};

export default Menu;