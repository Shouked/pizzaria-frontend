// src/components/Admin.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const Admin = ({ user, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products');

  // Produtos State
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const [editingProductId, setEditingProductId] = useState(null);

  // Pedidos State
  const [orders, setOrders] = useState([]);

  // Usuários State
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      alert('Acesso negado! Apenas administradores podem acessar.');
      navigate(`/${tenantId}`);
    } else {
      fetchProducts();
      fetchOrders();
      fetchUsers();
    }
  }, [tenantId, user]);

  // =======================
  // CRUD DE PRODUTOS
  // =======================
  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products/${tenantId}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editingProductId) {
        await api.put(`/products/${tenantId}/products/${editingProductId}`, formData, config);
        alert('Produto atualizado com sucesso!');
      } else {
        await api.post(`/products/${tenantId}/products`, formData, config);
        alert('Produto adicionado com sucesso!');
      }

      setFormData({ name: '', description: '', price: '', imageUrl: '' });
      setEditingProductId(null);
      fetchProducts();

    } catch (err) {
      console.error('Erro ao salvar produto:', err);
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl
    });
    setEditingProductId(product._id);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    const token = localStorage.getItem('token');
    try {
      await api.delete(`/products/${tenantId}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Produto excluído!');
      fetchProducts();
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
    }
  };

  // =======================
  // GERENCIAMENTO DE PEDIDOS
  // =======================
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

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      await api.put(`/orders/${tenantId}/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Status do pedido atualizado!');
      fetchOrders();
    } catch (err) {
      console.error('Erro ao atualizar status do pedido:', err);
    }
  };

  // =======================
  // GERENCIAMENTO DE USUÁRIOS
  // =======================
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await api.get(`/user/${tenantId}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    }
  };

  const handleToggleAdmin = async (userId, isAdmin) => {
    const token = localStorage.getItem('token');
    try {
      await api.put(`/user/${tenantId}/users/${userId}`, { isAdmin: !isAdmin }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Usuário ${!isAdmin ? 'promovido a admin' : 'rebaixado para usuário'}`);
      fetchUsers();
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    const token = localStorage.getItem('token');
    try {
      await api.delete(`/user/${tenantId}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Usuário excluído com sucesso!');
      fetchUsers();
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Painel Administrativo</h2>

      {/* Tabs de navegação */}
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
          Produtos
        </button>
        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
          Pedidos
        </button>
        <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
          Usuários
        </button>
      </div>

      {/* Aba de Produtos */}
      {activeTab === 'products' && (
        <>
          {/* (mesmo conteúdo que já criamos para produtos) */}
        </>
      )}

      {/* Aba de Pedidos */}
      {activeTab === 'orders' && (
        <>
          {/* (mesmo conteúdo que já criamos para pedidos) */}
        </>
      )}

      {/* Aba de Usuários */}
      {activeTab === 'users' && (
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl mb-4">Usuários</h3>
          {users.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            users.map((u) => (
              <div key={u._id} className="mb-4 border-b pb-2 flex justify-between items-center">
                <div>
                  <p><strong>Nome:</strong> {u.name}</p>
                  <p><strong>Email:</strong> {u.email}</p>
                  <p><strong>Admin:</strong> {u.isAdmin ? 'Sim' : 'Não'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleAdmin(u._id, u.isAdmin)}
                    className={`px-2 py-1 rounded ${u.isAdmin ? 'bg-yellow-500' : 'bg-green-500'} text-white`}
                  >
                    {u.isAdmin ? 'Remover Admin' : 'Promover Admin'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
