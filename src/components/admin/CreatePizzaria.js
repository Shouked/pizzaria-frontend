import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const CreatePizzaria = ({ onSuccess }) => {
  const [form, setForm] = useState({
    tenantId: '',
    name: '',
    logoUrl: '',
    phone: '',
    address: {
      cep: '',
      street: '',
      number: '',
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['cep', 'street', 'number'].includes(name)) {
      setForm(prev => ({
        ...prev,
        address: { ...prev.address, [name]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tenantId || !form.name) {
      toast.error('Preencha o ID e o nome da pizzaria.');
      return;
    }

    try {
      await api.post('/tenants', form);
      toast.success('Pizzaria cadastrada com sucesso!');
      setForm({
        tenantId: '',
        name: '',
        logoUrl: '',
        phone: '',
        address: { cep: '', street: '', number: '' }
      });
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
        placeholder="ID único (ex: pizzabia)"
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
        name="phone"
        placeholder="Telefone da pizzaria (ex: 11988887777)"
        value={form.phone}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2"
      />

      <input
        name="cep"
        placeholder="CEP"
        value={form.address.cep}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2"
      />

      <input
        name="street"
        placeholder="Rua"
        value={form.address.street}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2"
      />

      <input
        name="number"
        placeholder="Número"
        value={form.address.number}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-3"
      />

      <input
        name="logoUrl"
        placeholder="URL do logo (opcional)"
        value={form.logoUrl}
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