// src/components/Orders.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const Orders = ({ user }) => {
  const { tenantId } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await api.get(`/orders/${tenantId}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
      }
    };
    fetchOrders();
  }, [tenantId]);

  return (
    <div>
      <h2>Meus Pedidos</h2>
      {orders.length === 0 && <p>Você ainda não fez nenhum pedido.</p>}
      {orders.map((order) => (
        <div key={order._id}>
          <p>Pedido: {order._id}</p>
          <p>Status: {order.status}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Orders;
