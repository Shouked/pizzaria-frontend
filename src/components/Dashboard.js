import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Dashboard = ({ user }) => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const { primaryColor } = useTheme();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('7days');

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

  const filteredOrders = orders.filter((order) => {
    const orderDate = dayjs(order.createdAt);
    const now = dayjs();

    if (filter === 'today') {
      return orderDate.isSame(now, 'day');
    } else if (filter === '7days') {
      return orderDate.isAfter(now.subtract(7, 'day'));
    } else if (filter === 'month') {
      return orderDate.isSame(now, 'month');
    }
    return true;
  });

  const totalVendas = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalPedidos = filteredOrders.length;
  const pedidosPendentes = filteredOrders.filter((o) => o.status === 'pending').length;
  const ticketMedio = totalPedidos > 0 ? totalVendas / totalPedidos : 0;

  const ordersByStatus = [
    { name: 'Pendente', value: pedidosPendentes },
    { name: 'Finalizado', value: filteredOrders.filter((o) => o.status === 'completed').length },
    { name: 'Cancelado', value: filteredOrders.filter((o) => o.status === 'canceled').length },
  ];

  const salesData = filteredOrders.reduce((acc, order) => {
    const date = dayjs(order.createdAt).format('DD/MM');
    const existing = acc.find((item) => item.date === date);

    if (existing) {
      existing.total += order.total;
    } else {
      acc.push({ date, total: order.total });
    }

    return acc;
  }, []);

  const productSales = products.map((product) => {
    const count = filteredOrders.reduce((sum, order) => {
      const found = order.items.find((item) => item.productId === product._id);
      return sum + (found ? found.quantity : 0);
    }, 0);

    return { name: product.name, sales: count };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text('Relatório de Pedidos', 14, 20);
    const tableData = filteredOrders.map((order) => ([
      order._id,
      order.status,
      `R$ ${order.total.toFixed(2)}`,
      dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')
    ]));

    doc.autoTable({
      head: [['ID', 'Status', 'Total', 'Data']],
      body: tableData,
      startY: 30,
    });

    doc.save(`Relatorio-Pedidos-${filter}.pdf`);
  };

  const exportCSV = () => {
    let csv = 'ID,Status,Total,Data\n';
    filteredOrders.forEach((order) => {
      csv += `${order._id},${order.status},${order.total},${dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Relatorio-Pedidos-${filter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>Dashboard Administrativo</h2>

        <div className="flex gap-4">
          <select
            className="px-4 py-2 border rounded bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="7days">Últimos 7 dias</option>
            <option value="today">Hoje</option>
            <option value="month">Mês atual</option>
            <option value="all">Todos</option>
          </select>

          <button
            onClick={exportPDF}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Exportar PDF
          </button>
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Métricas de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <h4 className="text-sm text-gray-500 mb-2">Total de Vendas</h4>
          <p className="text-2xl font-bold" style={{ color: primaryColor }}>
            R$ {totalVendas.toFixed(2)}
          </p>
        </div>
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <h4 className="text-sm text-gray-500 mb-2">Total de Pedidos</h4>
          <p className="text-2xl font-bold" style={{ color: primaryColor }}>
            {totalPedidos}
          </p>
        </div>
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <h4 className="text-sm text-gray-500 mb-2">Pedidos Pendentes</h4>
          <p className="text-2xl font-bold" style={{ color: primaryColor }}>
            {pedidosPendentes}
          </p>
        </div>
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <h4 className="text-sm text-gray-500 mb-2">Ticket Médio</h4>
          <p className="text-2xl font-bold" style={{ color: primaryColor }}>
            R$ {ticketMedio.toFixed(2)}
          </p>
        </div>
      </div>

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
