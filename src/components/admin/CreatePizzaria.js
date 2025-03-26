// src/components/admin/CreatePizzaria.js
import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const CreatePizzaria = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    tenantId: '',
    logoUrl: '',
    primaryColor: '#e63946',
    secondaryColor: '#1d3557'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Máscara para tenantId: só letras minúsculas e sem espaços ou acentos
    if (name === 'tenantId') {
      const formatted = value
        .toLowerCase()
        .replace(/\s+/g, '') // remove espaços
        .replace(/[^a-z0-9]/g, ''); // remove tudo que não for letra ou número
      setForm((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/tenants', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Pizzaria criada com sucesso!');
      setForm({
        name: '',
        tenantId: '',
        logoUrl: '',
        primaryColor: '#e63946',
        secondaryColor: '#1d3557'
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao criar pizzaria:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar pizzaria');
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold text-[#e63946] mb-4">Criar Nova Pizzaria</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nome da pizzaria"
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="tenantId"
          value={form.tenantId}
          onChange={handleChange}
          placeholder="Identificador (ex: pizzabia)"
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="logoUrl"
          value={form.logoUrl}
          onChange={handleChange}
          placeholder="URL do logo (opcional)"
          className="p-2 border border-gray-300 rounded"
        />
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Cor primária</label>
            <input
              type="color"
              name="primaryColor"
              value={form.primaryColor}
              onChange={handleChange}
              className="w-12 h-8 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Cor secundária</label>
            <input
              type="color"
              name="secondaryColor"
              value={form.secondaryColor}
              onChange={handleChange}
              className="w-12 h-8 rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#e63946] text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default CreatePizzaria;