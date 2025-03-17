import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Menu = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [activeSection, setActiveSection] = useState('Todas');
  const sectionRefs = useRef({
    Todas: useRef(null),
    Pizza: useRef(null),
    Bebidas: useRef(null),
    Sobremesa: useRef(null),
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const options = {
        root: null,
        rootMargin: '0px 0px -80% 0px', // Detecta quando a seção está quase no topo
        threshold: 0.1,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.dataset.section);
          }
        });
      }, options);

      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref.current) observer.observe(ref.current);
      });

      return () => {
        Object.values(sectionRefs.current).forEach((ref) => {
          if (ref.current) observer.unobserve(ref.current);
        });
      };
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const scrollToSection = (section) => {
    const ref = sectionRefs.current[section];
    if (ref.current) {
      const headerOffset = 0; // Sem offset fixo, vai direto ao topo da seção
      const elementPosition = ref.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const categories = ['Todas', 'Pizza', 'Bebidas', 'Sobremesa'];

  return (
    <div className="relative">
      <nav className="bg-white border-b border-gray-200 w-full z-40">
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="flex overflow-x-auto whitespace-nowrap py-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => scrollToSection(category)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeSection === category
                    ? 'text-[#e63946] border-b-2 border-[#e63946]'
                    : 'text-gray-600 hover:text-[#e63946]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-screen-lg mx-auto px-4 pt-4">
        {categories.map((category) => (
          <div
            key={category}
            ref={sectionRefs.current[category]}
            data-section={category}
            className="py-4"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((product) =>
                  category === 'Todas' ? true : product.category === category
                )
                .map((product) => (
                  <div
                    key={product._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-center text-sm mb-2">
                      {product.description}
                    </p>
                    <p className="text-[#e63946] font-bold mb-2">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-[#e63946] text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
                    >
                      Adicionar ao Carrinho
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
