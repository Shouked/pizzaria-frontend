// src/components/SuperAdminPanel.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SuperAdminPanel = () => {
  const [form, setForm] = useState({ tenantId: '', name: '', logoUrl: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateTenant = async () => {
    if (!form.tenantId || !form.name) {
      toast.error('Preencha o ID e nome da pizzaria.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.post(
        'https://pizzaria-backend-e254.onrender.com/api/tenants',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Pizzaria criada com sucesso!');
      setForm({ tenantId: '', name: '', logoUrl: '' });
    } catch (err) {
      console.error(err);
      toast.error('Erro ao criar pizzaria.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4 text-[#e63946]">Criar Nova Pizzaria</h2>

      <input
        name="tenantId"
        placeholder="Identificador (ex: pizza-bia)"
        value={form.tenantId}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-3"
      />
      <input
        name="name"
        placeholder="Nome da Pizzaria"
        value={form.name}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-3"
      />
      <input
        name="logoUrl"
        placeholder="Logo (URL da imagem)"
        value={form.logoUrl}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-4"
      />

      <button
        onClick={handleCreateTenant}
        disabled={loading}
        className="bg-[#e63946] text-white w-full py-2 rounded hover:bg-red-600 transition"
      >
        {loading ? 'Criando...' : 'Criar Pizzaria'}
      </button>
    </div>
  );
};

export default SuperAdminPanel;