import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Admin = ({ user, setIsLoginOpen }) => {
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User recebido em Admin:', user);
    if (!user) {
      console.log('Nenhum usuário logado, abrindo login');
      setIsLoginOpen(true);
      return;
    }
    if (!user.isAdmin) {
      console.log('Usuário não é admin, não deve estar aqui');
      return; // Não redireciona, deixa o App.js lidar com isso
    }
    console.log('Usuário é admin, carregando tenants');
    fetchTenants();
  }, [user, setIsLoginOpen]);

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fazendo requisição para /api/tenants com token:', token);
      const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/tenants', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Tenants recebidos:', response.data);
      setTenants(response.data);
    } catch (err) {
      console.error('Erro ao listar tenants:', err);
      toast.error('Erro ao carregar pizzarias.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Cadastrando tenant:', { tenantId, name, description });
      const response = await axios.post(
        'https://pizzaria-backend-e254.onrender.com/api/tenants',
        { tenantId, name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTenants([...tenants, response.data]);
      setTenantId('');
      setName('');
      setDescription('');
      toast.success('Pizzaria cadastrada com sucesso!');
    } catch (err) {
      console.error('Erro ao cadastrar tenant:', err);
      toast.error(err.response?.data?.message || 'Erro ao cadastrar pizzaria.');
    }
  };

  if (!user || !user.isAdmin) {
    console.log('Renderização bloqueada: sem usuário ou não é admin');
    return null;
  }

  console.log('Renderizando página de admin');
  return (
    <div className="container mx-auto p-4 bg-[#f1faee] min-h-screen">
      <h1 className="text-3xl font-bold text-[#e63946] mb-6 text-center">Administração de Pizzarias</h1>
      
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">ID da Pizzaria (ex.: pizzaria-joao)</label>
          <input
            type="text"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            className="w-full p-2 border rounded"
            placeholder="Digite um ID único"
            required
          />
          <p className="text-sm text-gray-500 mt-1">Use letras minúsculas e hífens, sem espaços.</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Nome da Pizzaria</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex.: Pizzaria do João"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Descrição (opcional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Descrição da pizzaria"
          />
        </div>
        <button
          type="submit"
          className="bg-[#e63946] text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Cadastrar Pizzaria
        </button>
      </form>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Pizzarias Cadastradas</h2>
      {tenants.length === 0 ? (
        <p className="text-gray-600">Nenhuma pizzaria cadastrada ainda.</p>
      ) : (
        <ul className="space-y-4">
          {tenants.map((tenant) => (
            <li key={tenant.tenantId} className="bg-white p-4 rounded-lg shadow-md">
              <p><strong>ID:</strong> {tenant.tenantId}</p>
              <p><strong>Nome:</strong> {tenant.name}</p>
              {tenant.description && <p><strong>Descrição:</strong> {tenant.description}</p>}
              <p><strong>Link:</strong> <a href={`/${tenant.tenantId}`} className="text-[#e63946] hover:underline">{`pizzadabia.netlify.app/${tenant.tenantId}`}</a></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Admin;