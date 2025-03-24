// src/components/Admin.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const Admin = ({ user, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: ''
  });
  const [editingProductId, setEditingProductId] = useState(null);

  // Verificação básica: só admins acessam
  useEffect(() => {
    if (!user || !user.isAdmin) {
      alert('Acesso negado! Apenas administradores podem acessar.');
      navigate(`/${tenantId}`);
    } else {
      fetchProducts();
    }
  }, [tenantId, user]);

  // Buscar produtos do tenant atual
  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products/${tenantId}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  };

  // Adicionar ou editar produto
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editingProductId) {
        // Editar produto existente
        await api.put(`/products/${tenantId}/products/${editingProductId}`, formData, config);
        alert('Produto atualizado com sucesso!');
      } else {
        // Adicionar novo produto
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

  // Preenche o form para edição
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl
    });
    setEditingProductId(product._id);
  };

  // Exclui produto
  const handleDelete = async (productId) => {
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Painel Administrativo</h2>

      {/* Formulário para adicionar/editar produtos */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 shadow rounded">
        <h3 className="text-xl mb-4">{editingProductId ? 'Editar Produto' : 'Novo Produto'}</h3>

        <input
          type="text"
          placeholder="Nome"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="block w-full mb-2 p-2 border rounded"
        />

        <textarea
          placeholder="Descrição"
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="block w-full mb-2 p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Preço"
          name="price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
          className="block w-full mb-2 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="URL da Imagem"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          required
          className="block w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {editingProductId ? 'Atualizar Produto' : 'Adicionar Produto'}
        </button>
      </form>

      {/* Lista de produtos */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-xl mb-4">Produtos Cadastrados</h3>
        {products.length === 0 ? (
          <p>Nenhum produto cadastrado.</p>
        ) : (
          <ul>
            {products.map((product) => (
              <li key={product._id} className="mb-4 border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p>R$ {product.price}</p>
                    <img src={product.imageUrl} alt={product.name} className="h-16 mt-2" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Admin;
