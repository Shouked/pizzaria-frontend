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
      const bannerHeight = 144; // Altura aproximada do banner em telas pequenas (h-36 = 9rem = 144px)
      const scrollPosition = window.scrollY;

      // Fixar a barra de navegação quando o banner sair da tela
      setIsNavFixed(scrollPosition > bannerHeight);

      // Detectar qual seção está visível
      const options = {
        root: null,
        rootMargin: '0px 0px -80% 0px', // Ajusta para detectar quando a seção está quase no topo
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
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const scrollToSection = (section) => {
    const ref = sectionRefs.current[section];
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - (isNavFixed ? 60 : 0), // Ajusta para o topo da seção, considerando a altura da barra fixa
        behavior: 'smooth',
      });
    }
  };

  const categories = ['Pizza', 'Bebidas', 'Sobremesa'];

  return (
    <div className="container mx-auto p-4">
      {/* Barra de Navegação das Categorias */}
      <nav
        className={`bg-white shadow-md w-full z-40 ${
          isNavFixed ? 'fixed top-0 left-0 right-0' : ''
        }`}
      >
        <div className="container mx-auto flex justify-around py-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => scrollToSection(category)}
              className={`text-sm md:text-base font-semibold ${
                activeSection === category
                  ? 'text-[#e63946] border-b-2 border-[#e63946]'
                  : 'text-gray-700 hover:text-[#e63946]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </nav>

      {/* Seções de Produtos */}
      <div className={`${isNavFixed ? 'pt-16' : ''}`}>
        {categories.map((category) => (
          <div
            key={category}
            ref={sectionRefs.current[category]}
            data-section={category}
            className="mt-6"
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <div
                    key={product._id}
                    className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
                  >
                    <img
                      src={product.image || '/pizza.png'}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-full mb-2"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {product.description}
                    </p>
                    <p className="text-[#e63946] font-bold mb-2">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-[#e63946] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
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
