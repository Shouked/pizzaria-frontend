
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const OrderSummary = ({ cart, setCart, user, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const { primaryColor } = useTheme();

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const handleOrder = async () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    try {
      await api.post(`/orders/${tenantId}/orders`, { items: cart }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCart([]);
      alert('Pedido realizado com sucesso!');
    } catch (err) {
      console.error('Erro ao fazer pedido:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>Resumo do Pedido</h1>
      <ul>
        {cart.map((item, index) => (
          <li key={index} className="border p-4 rounded shadow mb-2">
            {item.name} - R$ {item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <p className="font-bold mt-4">Total: R$ {total.toFixed(2)}</p>
      <button onClick={handleOrder} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Finalizar Pedido</button>
    </div>
  );
};

export default OrderSummary;
