// src/components/Menu.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const Menu = ({ cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();
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
    <div>
      <h2>Menu de Pizzas</h2>
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <p>{product.name}</p>
          <p>R$ {product.price}</p>
          <button onClick={() => addToCart(product)}>Adicionar ao Carrinho</button>
        </div>
      ))}
    </div>
  );
};

export default Menu;
