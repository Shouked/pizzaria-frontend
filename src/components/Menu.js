import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Menu = ({ cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const { primaryColor } = useTheme();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/${tenantId}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      }
    };

    fetchProducts();
  }, [tenantId]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, { ...product, quantity: 1 }]);
  };

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>Cardápio</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg flex flex-col justify-between"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img
              src={product.imageUrl || '/pizza.png'}
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-500 mb-2">{product.description}</p>
            <p className="text-lg font-bold mb-4">R$ {product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: primaryColor }}
            >
              Adicionar ao Carrinho
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Menu;
