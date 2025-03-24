
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

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
    setCart([...cart, product]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>Cardápio</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{product.name}</h2>
            <p>{product.description}</p>
            <p>R$ {product.price.toFixed(2)}</p>
            <button onClick={() => addToCart(product)}>Adicionar ao Carrinho</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
