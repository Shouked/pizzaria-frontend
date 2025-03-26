import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const SuperAdminPanel = () => {
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({ name: '', tenantId: '' });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await api.get('/tenants');
      setTenants(res.data);
    } catch (err) {
      toast.error('Erro ao carregar pizzarias.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === 'tenantId') {
      val = val.toLowerCase().replace(/[^a-z0-9-]/g, '').trim();
    }

    setForm({ ...form, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.tenantId) {
      toast.warning('Preencha todos os campos.');
      return;
    }

    try {
      const res = await api.post('/tenants', form);
      toast.success('Pizzaria cadastrada com sucesso!');
      setForm({ name: '', tenantId: '' });
      fetchTenants();
    } catch (err) {
      toast.error('Erro ao cadastrar pizzaria.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-[#e63946] mb-4">Cadastrar Nova Pizzaria</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome da Pizzaria</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Identificador (tenantId)</label>
          <input
            type="text"
            name="tenantId"
            value={form.tenantId}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Use apenas letras minúsculas, números e hífens. Ex: <strong>pizza-bia</strong></p>
        </div>
        <button
          type="submit"
          className="bg-[#e63946] text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Cadastrar
        </button>
      </form>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold text-gray-700 mb-4">Pizzarias Cadastradas</h3>
      <ul className="space-y-2">
        {tenants.map((tenant) => (
          <li key={tenant._id} className="border rounded p-3 shadow-sm bg-white">
            <strong>{tenant.name}</strong> — <code className="text-sm text-gray-600">/{tenant.tenantId}</code>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuperAdminPanel;
