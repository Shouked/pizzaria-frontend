import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Menu = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [activeSection, setActiveSection] = useState('Pizza');
  const [isNavFixed, setIsNavFixed] = useState(false);
  const sectionRefs = useRef({
    Pizza: useRef(null),
    Bebidas: useRef(null),
    Sobremesa: useRef(null),
    Esfihas: useRef(null),
    Beirutes: useRef(null),
    Calzones: useRef(null),
    Fogazzas: useRef(null),
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/products');
        // Normalizar as categorias para minúsculas
        const normalizedProducts = response.data.map((product) => ({
          ...product,
          category: product.category.toLowerCase(),
        }));
        setProducts(normalizedProducts);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const bannerHeight = 144; // Altura do banner (h-36 = 9rem = 144px)
      const scrollPosition = window.scrollY;

      // Fixar a barra quando o banner sair da tela
      setIsNavFixed(scrollPosition > bannerHeight);

      // Detectar seção ativa
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
      const headerOffset = isNavFixed ? 60 : 0; // Ajusta para a altura da barra fixa
      const elementPosition = ref.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const categories = [
    'Pizza',
    'Bebidas',
    'Sobremesa',
    'Esfihas',
    'Beirutes',
    'Calzones',
    'Fogazzas',
  ];
  const normalizedCategories = categories.map((cat) => cat.toLowerCase());

  return (
    <div className="relative">
      <nav
        className={`bg-white border-b border-gray-200 w-full z-40 ${
          isNavFixed ? 'fixed top-0 left-0 right-0 shadow-md' : ''
        }`}
      >
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

      <div className={`max-w-screen-lg mx-auto px-4 ${isNavFixed ? 'pt-16' : 'pt-4'} pb-20`}>
        {normalizedCategories.map((category) => (
          <div
            key={category}
            ref={sectionRefs.current[category.charAt(0).toUpperCase() + category.slice(1)]}
            data-section={category.charAt(0).toUpperCase() + category.slice(1)}
            className="py-4"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <div
                    key={product._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
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