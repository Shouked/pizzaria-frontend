import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = ({ user, setIsLoginOpen }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user._id) {
        setError('Usuário não autenticado. Faça login.');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://pizzaria-backend-e254.onrender.com/api/orders/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
        setError('Erro ao carregar pedidos. Tente novamente.');
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <div className="container mx-auto p-4 bg-[#f1faee] min-h-screen">
      <h1 className="text-3xl font-bold text-[#e63946] mb-4 text-center">Meus Pedidos</h1>
      {error && (
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          {!user && (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition"
            >
              Fazer Login
            </button>
          )}
        </div>
      )}
      {orders.length === 0 && !error ? (
        <p className="text-center text-gray-600">Nenhum pedido encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <p>Data: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Total: R$ {order.total.toFixed(2)}</p>
              <ul className="mt-2">
                {order.items.map((item, index) => (
                  <li key={index} className="text-gray-600">
                    {item.quantity}x {item.product.name || 'Produto desconhecido'}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
