import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const CreatePizzaria = ({ onSuccess }) => {
  const [form, setForm] = useState({
    tenantId: '',
    name: '',
    logoUrl: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tenantId || !form.name) {
      toast.error('Preencha o ID e o nome da pizzaria.');
      return;
    }

    try {
      const payload = {
        tenantId: form.tenantId,
        name: form.name,
        logoUrl: form.logoUrl,
        address: {
          cep: form.cep,
          street: form.street,
          number: form.number,
        },
        phone: form.phone,
      };

      await api.post('/tenants', payload);
      toast.success('Pizzaria cadastrada com sucesso!');
      setForm({ tenantId: '', name: '', logoUrl: '', phone: '', cep: '', street: '', number: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Erro ao cadastrar pizzaria.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Cadastrar nova pizzaria</h2>

      <input
        name="tenantId"
        placeholder="ID único (ex: pizza-bia)"
        value={form.tenantId}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2"
        required
      />

      <input
        name="name"
        placeholder="Nome da pizzaria"
        value={form.name}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2"
        required
      />

      <input
        name="logoUrl"
        placeholder="URL do logo (opcional)"
        value={form.logoUrl}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2"
      />

      <input
        name="phone"
        placeholder="Telefone do dono"
        value={form.phone}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2"
      />

      <input
        name="cep"
        placeholder="CEP da pizzaria"
        value={form.cep}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2"
      />

      <input
        name="street"
        placeholder="Rua"
        value={form.street}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2"
      />

      <input
        name="number"
        placeholder="Número"
        value={form.number}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-3"
      />

      <button
        type="submit"
        className="bg-[#e63946] text-white px-4 py-2 rounded hover:bg-red-700 w-full"
      >
        Criar Pizzaria
      </button>
    </form>
  );
};

export default CreatePizzaria;