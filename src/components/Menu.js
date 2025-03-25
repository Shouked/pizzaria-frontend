import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const Menu = ({ cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/${tenantId}/products`);
        const fetchedProducts = res.data;

        const grouped = fetchedProducts.reduce((acc, product) => {
          const category = product.category?.toLowerCase() || 'outros';
          if (!acc[category]) acc[category] = [];
          acc[category].push(product);
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

  const scrollToCategory = (category) => {
    const ref = sectionRefs.current[category];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory(category);
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
    <div className="p-4 pt-2 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-center text-[#e63946] mb-2">Cardápio</h2>

      {/* Barra de Categorias */}
      <div className="sticky top-0 bg-[#f1faee] py-2 z-40 shadow-sm">
        <div className="flex gap-2 overflow-x-auto px-2 justify-center md:justify-center scrollbar-hide">
          {Object.keys(groupedProducts).map((category) => (
            <button
              key={category}
              onClick={() => scrollToCategory(category)}
              className={`whitespace-nowrap border px-4 py-1 rounded-full text-sm capitalize transition-all ${
                activeCategory === category
                  ? 'bg-[#e63946] text-white border-[#e63946]'
                  : 'bg-white text-[#e63946] border-[#e63946]'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Produtos por Categoria */}
      <div className="space-y-6 mt-4">
        {Object.entries(groupedProducts).map(([category, items]) => (
          <div
            key={category}
            ref={(el) => (sectionRefs.current[category] = el)}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2 capitalize">
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
                >
                  {/* <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded mb-2"
                  /> */}
                  <h4 className="text-md font-bold text-[#1d3557] mb-1">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {product.description}
                  </p>
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
