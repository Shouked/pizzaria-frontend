// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { primaryColor } = useTheme();
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({ name: '', tenantId: '' });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token não encontrado');
      return;
    }

    try {
      const res = await api.get('/tenants', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTenants(res.data);
    } catch (err) {
      console.error('Erro ao carregar tenants:', err);
      toast.error('Erro ao carregar pizzarias');
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    if (!form.name || !form.tenantId) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      await api.post('/tenants', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Pizzaria criada com sucesso!');
      setForm({ name: '', tenantId: '' });
      fetchTenants();
    } catch (err) {
      console.error('Erro ao criar tenant:', err);
      toast.error('Erro ao criar pizzaria');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
        Painel do Super Admin
      </h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Cadastrar Nova Pizzaria</h2>
        <input
          type="text"
          placeholder="Nome da pizzaria"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Tenant ID (sem espaços ou caracteres especiais)"
          value={form.tenantId}
          onChange={(e) =>
            setForm({ ...form, tenantId: e.target.value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() })
          }
          className="w-full border border-gray-300 p-2 rounded mb-4"
        />
        <button
          onClick={handleCreate}
          className="bg-[#e63946] text-white px-4 py-2 rounded hover:bg-red-600 w-full"
        >
          Criar Pizzaria
        </button>
      </div>

      <h2 className="text-lg font-bold mb-3 text-gray-800">Pizzarias Cadastradas</h2>
      <ul className="space-y-3">
        {tenants.map((tenant) => (
          <li key={tenant._id} className="p-4 bg-white rounded shadow">
            <p className="font-bold text-lg">{tenant.name}</p>
            <p className="text-sm text-gray-500">Tenant ID: {tenant.tenantId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;