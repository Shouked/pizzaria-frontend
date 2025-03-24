// src/components/OrderSummary.js
import React from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const OrderSummary = ({ user, cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();

  const placeOrder = async () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await api.post(`/orders/${tenantId}/orders`, {
        items: cart.map(({ _id, quantity }) => ({ productId: _id, quantity })),
        total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Pedido realizado com sucesso!');
      setCart([]);
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
    }
  };

  return (
    <div>
      <h2>Resumo do Pedido</h2>
      {cart.length === 0 && <p>Carrinho vazio!</p>}
      {cart.map((item) => (
        <div key={item._id}>
          {item.name} - {item.quantity}x
        </div>
      ))}
      <p>Total: R$ {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</p>
      <button onClick={placeOrder}>Finalizar Pedido</button>
    </div>
  );
};

export default OrderSummary;
