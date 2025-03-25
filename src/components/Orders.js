// src/components/Orders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Orders = ({ user, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        setIsLoginOpen(true);
        return;
      }

      try {
        const response = await axios.get(
          `https://pizzaria-backend-e254.onrender.com/api/orders/${tenantId}/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error.response?.data || error.message);
        alert('Erro ao carregar seus pedidos.');
      }
    };

    if (tenantId) {
      fetchOrders();
    }
  }, [tenantId, user, setIsLoginOpen]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#e63946] mb-4">Meus Pedidos</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">Você ainda não fez nenhum pedido.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="border p-4 rounded shadow-sm bg-white">
              <h3 className="font-semibold text-[#1d3557] mb-2">Pedido #{order._id.slice(-6)}</h3>
              <ul className="mb-2">
                {order.items.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {item.quantity}x {item.name || 'Produto'}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600">Total: R$ {order.total.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Status: {order.status}</p>
              <p className="text-sm text-gray-400">Data: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;