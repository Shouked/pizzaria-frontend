import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = ({ user }) => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const { primaryColor } = useTheme();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      alert('Acesso negado! Apenas administradores podem acessar.');
      navigate(`/${tenantId}`);
    } else {
      fetchOrders();
      fetchProducts();
    }
  }, [tenantId, user]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await api.get(`/orders/${tenantId}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await api.get(`/products/${tenantId}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  };

  // Tratamento de dados para gráficos
  const ordersByStatus = [
    { name: 'Pendente', value: orders.filter((o) => o.status === 'pending').length },
    { name: 'Finalizado', value: orders.filter((o) => o.status === 'completed').length },
    { name: 'Cancelado', value: orders.filter((o) => o.status === 'canceled').length },
  ];

  const salesData = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    const existing = acc.find((item) => item.date === date);

    if (existing) {
      existing.total += order.total;
    } else {
      acc.push({ date, total: order.total });
    }

    return acc;
  }, []);

  const productSales = products.map((product) => {
    const count = orders.reduce((sum, order) => {
      const found = order.items.find((item) => item.productId === product._id);
      return sum + (found ? found.quantity : 0);
    }, 0);

    return { name: product.name, sales: count };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>Dashboard Administrativo</h2>

      {/* Pedidos por Status */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-xl font-semibold mb-4">Pedidos por Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ordersByStatus}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {ordersByStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Vendas por Dia */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-xl font-semibold mb-4">Vendas por Dia</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill={primaryColor} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Produtos Mais Vendidos */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-xl font-semibold mb-4">Produtos Mais Vendidos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productSales} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="sales" fill={primaryColor} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
