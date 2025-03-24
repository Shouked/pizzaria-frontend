import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

const Admin = ({ user }) => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const { primaryColor } = useTheme();

  const [activeTab, setActiveTab] = useState('products');

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const [editingProductId, setEditingProductId] = useState(null);

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

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products/${tenantId}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  };

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

      {/* Botão para o Dashboard */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate(`/${tenantId}/admin/dashboard`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          📊 Ver Dashboard
        </button>
      </div>

      {/* Tabs de navegação */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
        >
          Produtos
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
        >
          Pedidos
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
        >
          Usuários
        </button>
      </div>

      {/* Aba de Produtos */}
      {activeTab === 'products' && (
        <>
          <form onSubmit={handleSubmitProduct} className="mb-6 bg-white p-4 shadow rounded">
            <h3 className="text-xl mb-4">{editingProductId ? 'Editar Produto' : 'Novo Produto'}</h3>
            <input type="text" placeholder="Nome" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="block w-full mb-2 p-2 border rounded" />
            <textarea placeholder="Descrição" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required className="block w-full mb-2 p-2 border rounded" />
            <input type="number" placeholder="Preço" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="block w-full mb-2 p-2 border rounded" />
            <input type="text" placeholder="URL da Imagem" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} required className="block w-full mb-4 p-2 border rounded" />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{editingProductId ? 'Atualizar' : 'Adicionar'}</button>
          </form>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-xl mb-4">Produtos</h3>
            {products.length === 0 ? <p>Nenhum produto cadastrado.</p> : (
              products.map((product) => (
                <div key={product._id} className="mb-4 border-b pb-2 flex justify-between">
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p>R$ {product.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditProduct(product)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-600 text-white px-2 py-1 rounded">Excluir</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Aba de Pedidos */}
      {activeTab === 'orders' && (
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl mb-4">Pedidos</h3>
          {orders.length === 0 ? <p>Nenhum pedido encontrado.</p> : (
            orders.map((order) => (
              <div key={order._id} className="mb-4 border-b pb-2">
                <p><strong>ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> R$ {order.total}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Aba de Usuários */}
      {activeTab === 'users' && (
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl mb-4">Usuários</h3>
          {users.length === 0 ? <p>Nenhum usuário encontrado.</p> : (
            users.map((u) => (
              <div key={u._id} className="mb-4 border-b pb-2 flex justify-between items-center">
                <div>
                  <p><strong>Nome:</strong> {u.name}</p>
                  <p><strong>Email:</strong> {u.email}</p>
                  <p><strong>Admin:</strong> {u.isAdmin ? 'Sim' : 'Não'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleAdmin(u._id, u.isAdmin)} className={`px-2 py-1 rounded ${u.isAdmin ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>
                    {u.isAdmin ? 'Remover Admin' : 'Promover Admin'}
                  </button>
                  <button onClick={() => handleDeleteUser(u._id)} className="bg-red-600 text-white px-2 py-1 rounded">Excluir</button>
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
