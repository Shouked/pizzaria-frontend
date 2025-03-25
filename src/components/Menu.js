import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const Menu = ({ cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para carregamento
  const containerRef = useRef(null);
  const categoryRefs = useRef({});
  const categoryBarRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // Inicia o carregamento
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
        toast.error('Erro ao carregar o cardápio.');
      } finally {
        setIsLoading(false); // Termina o carregamento
      }
    };

    if (tenantId) {
      fetchProducts();
    }
  }, [tenantId]);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const barOffset = 48; // Altura da barra de categorias
    for (const [category, ref] of Object.entries(categoryRefs.current)) {
      if (ref && ref.offsetTop - barOffset <= scrollY) {
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
      window.scrollTo({ top: ref.offsetTop - 48, behavior: 'smooth' }); // Apenas a altura da barra
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
    <div ref={containerRef} className="w-full">
      {/* Barra de Categorias */}
      <div
        className="sticky top-0 z-40 bg-white border-b border-gray-100 overflow-x-auto no-scrollbar w-full shadow-sm md:max-w-md md:mx-auto"
        ref={categoryBarRef}
      >
        <div className="flex whitespace-nowrap px-4 py-2">
          {Object.keys(groupedProducts).map((category) => (
            <button
              key={category}
              id={`category-btn-${category}`}
              onClick={() => scrollToCategory(category)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-all duration-200 ${
                activeCategory === category
                  ? 'text-gray-900 border-b-2 border-[#e63946]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Seções de Produtos */}
      {isLoading ? (
        <p className="text-center text-gray-500 mt-8 text-lg px-4">Carregando...</p>
      ) : Object.entries(groupedProducts).length === 0 ? (
        <p className="text-center text-gray-500 mt-8 text-lg px-4">Nenhum produto disponível no momento.</p>
      ) : (
        Object.entries(groupedProducts).map(([category, items]) => (
          <div
            key={category}
            ref={(el) => (categoryRefs.current[category] = el)}
            className="px-4 py-8 max-w-5xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 capitalize tracking-wide">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h4>
                  <p className="text-sm text-gray-500 mb-3 flex-grow">{product.description}</p>
                  <p className="text-lg font-bold text-[#e63946] mb-4">R$ {product.price.toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-auto bg-[#e63946] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Menu;
