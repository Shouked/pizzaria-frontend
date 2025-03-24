
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Orders = ({ user, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const { primaryColor } = useTheme();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(`/orders/${tenantId}/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
      }
    };

    fetchOrders();
  }, [tenantId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>Meus Pedidos</h1>
      <ul>
        {orders.map(order => (
          <li key={order._id} className="border p-4 rounded shadow mb-2">
            <p><strong>Total:</strong> R$ {order.total.toFixed(2)}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
