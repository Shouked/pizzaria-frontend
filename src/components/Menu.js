import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const Menu = ({ cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const categoryRefs = useRef({});
  const containerRef = useRef(null);
  const categoriesBarRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/${tenantId}/products`);
        const fetchedProducts = res.data;

        const grouped = fetchedProducts.reduce((acc, product) => {
          const category = product.category || 'Outros';
          const categoryKey = category.toUpperCase();
          if (!acc[categoryKey]) acc[categoryKey] = [];
          acc[categoryKey].push(product);
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

  const scrollToCategory = (category) => {
    const ref = categoryRefs.current[category];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const current = entry.target.getAttribute('data-category');
            setActiveCategory(current);
            const categoryButton = document.getElementById(`btn-${current}`);
            if (categoryButton && categoriesBarRef.current) {
              categoryButton.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }
          }
        });
      },
      {
        rootMargin: '-60px 0px -80% 0px',
        threshold: 0.1,
      }
    );

    Object.values(categoryRefs.current).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [groupedProducts]);

  return (
    <div className="pt-4 pb-20 max-w-4xl mx-auto px-4" ref={containerRef}>
      {/* Barra de Categorias */}
      <div className="sticky top-0 z-30 bg-white py-2 shadow-md overflow-x-auto whitespace-nowrap scrollbar-hide" ref={categoriesBarRef}>
        <div className="flex space-x-3 px-2">
          {Object.keys(groupedProducts).map((category) => (
            <button
              key={category}
              id={`btn-${category}`}
              className={`px-4 py-1 rounded-full border transition text-sm capitalize ${
                activeCategory === category
                  ? 'bg-[#e63946] text-white font-bold'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => scrollToCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Produtos */}
      {Object.keys(groupedProducts).length === 0 && (
        <p className="text-center text-gray-500 mt-6">Nenhum produto disponível no momento.</p>
      )}

      {Object.entries(groupedProducts).map(([category, items]) => {
        if (!categoryRefs.current[category]) {
          categoryRefs.current[category] = React.createRef();
        }

        return (
          <div key={category} data-category={category} ref={categoryRefs.current[category]} className="mb-8">
            <h3 className="text-lg font-bold text-[#1d3557] mb-4 mt-6">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow p-4">
                  <h4 className="text-md font-semibold mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{product.description}</p>
                  <p className="text-sm font-semibold text-[#e63946] mb-2">R$ {product.price.toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-[#e63946] text-white py-1 rounded hover:bg-red-600 transition"
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;