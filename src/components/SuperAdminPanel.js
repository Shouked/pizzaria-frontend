import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const SuperAdminPanel = () => {
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({
    name: '',
    tenantId: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
  });
  const [editingTenant, setEditingTenant] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/tenants', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTenants(res.data);
    } catch (err) {
      toast.error('Erro ao carregar pizzarias.');
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === 'tenantId') {
      val = val.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    }

    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.tenantId) {
      toast.warning('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/tenants', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Pizzaria cadastrada com sucesso!');
      setForm({ name: '', tenantId: '', phone: '', cep: '', street: '', number: '' });
      fetchTenants();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Erro ao cadastrar pizzaria.');
    }
  };

  const startEdit = (tenant) => {
    setEditingTenant(tenant.tenantId);
    setEditForm(tenant);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const cancelEdit = () => {
    setEditingTenant(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/tenants/${editingTenant}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Pizzaria atualizada com sucesso!');
      setEditingTenant(null);
      setEditForm({});
      fetchTenants();
    } catch (err) {
      toast.error('Erro ao salvar alterações.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-[#e63946] mb-4">Cadastrar Nova Pizzaria</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded shadow p-4">
        <input name="name" placeholder="Nome da pizzaria" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="tenantId" placeholder="Identificador (sem hífen)" value={form.tenantId} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="phone" placeholder="Telefone do dono" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="cep" placeholder="CEP" value={form.cep} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="street" placeholder="Rua" value={form.street} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="number" placeholder="Número" value={form.number} onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="bg-[#e63946] text-white px-4 py-2 rounded hover:bg-red-600 w-full">Criar Pizzaria</button>
      </form>

      <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3">Pizzarias Cadastradas</h3>
      <ul className="space-y-4">
        {tenants.map((tenant) => (
          <li key={tenant._id} className="bg-white shadow p-4 rounded">
            {editingTenant === tenant.tenantId ? (
              <>
                <input name="name" value={editForm.name} onChange={handleEditChange} className="w-full border p-2 rounded mb-2" />
                <input name="phone" value={editForm.phone || ''} onChange={handleEditChange} className="w-full border p-2 rounded mb-2" placeholder="Telefone" />
                <input name="cep" value={editForm.cep || ''} onChange={handleEditChange} className="w-full border p-2 rounded mb-2" placeholder="CEP" />
                <input name="street" value={editForm.street || ''} onChange={handleEditChange} className="w-full border p-2 rounded mb-2" placeholder="Rua" />
                <input name="number" value={editForm.number || ''} onChange={handleEditChange} className="w-full border p-2 rounded mb-4" placeholder="Número" />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Salvar</button>
                  <button onClick={cancelEdit} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">Cancelar</button>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{tenant.name}</p>
                  <p className="text-sm text-gray-500">/{tenant.tenantId}</p>
                </div>
                <button
                  onClick={() => startEdit(tenant)}
                  className="bg-[#e63946] text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Consultar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuperAdminPanel;