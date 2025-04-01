// src/components/SuperAdminPanel.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import CreatePizzaria from './admin/CreatePizzaria';

const SuperAdminPanel = ({ handleLogout }) => {
  const [tenants, setTenants] = useState([]);
  const [editingTenant, setEditingTenant] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Token não encontrado. Faça login novamente.');
        return;
      }

      const res = await api.get('/tenants', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTenants(res.data);
    } catch (err) {
      console.error('Erro ao buscar pizzarias:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Erro ao carregar pizzarias.');
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const startEdit = (tenant) => {
    setEditingTenant(tenant.tenantId);
    setEditForm({
      name: tenant.name,
      phone: tenant.phone || '',
      address: {
        cep: tenant.address?.cep || '',
        street: tenant.address?.street || '',
        number: tenant.address?.number || ''
      }
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (['cep', 'street', 'number'].includes(name)) {
      setEditForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        }
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/tenants/${editingTenant}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Pizzaria atualizada!');
      setEditingTenant(null);
      fetchTenants();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar alterações.');
    }
  };

  const cancelEdit = () => {
    setEditingTenant(null);
    setEditForm({});
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#e63946]">Pizzarias Cadastradas</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Sair
        </button>
      </div>

      <CreatePizzaria onSuccess={fetchTenants} />

      <ul className="space-y-4">
        {tenants.map((tenant) => (
          <li key={tenant._id} className="bg-white p-4 rounded shadow">
            {editingTenant === tenant.tenantId ? (
              <div className="space-y-2">
                <input name="name" value={editForm.name} onChange={handleEditChange} className="w-full border p-2 rounded" placeholder="Nome" />
                <input name="phone" value={editForm.phone} onChange={handleEditChange} className="w-full border p-2 rounded" placeholder="Telefone" />
                <input name="cep" value={editForm.address?.cep} onChange={handleEditChange} className="w-full border p-2 rounded" placeholder="CEP" />
                <input name="street" value={editForm.address?.street} onChange={handleEditChange} className="w-full border p-2 rounded" placeholder="Rua" />
                <input name="number" value={editForm.address?.number} onChange={handleEditChange} className="w-full border p-2 rounded" placeholder="Número" />
                <div className="flex gap-2 mt-2">
                  <button onClick={saveEdit} className="bg-green-500 text-white px-4 py-1 rounded">Salvar</button>
                  <button onClick={cancelEdit} className="bg-gray-300 text-black px-4 py-1 rounded">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{tenant.name}</p>
                  <p className="text-sm text-gray-500">/{tenant.tenantId}</p>
                  <p className="text-sm text-gray-600">
                    {tenant.phone || '-'} | {tenant.address?.cep || '-'} | {tenant.address?.street || '-'}, {tenant.address?.number || '-'}
                  </p>
                </div>
                <button onClick={() => startEdit(tenant)} className="bg-[#e63946] text-white px-3 py-1 rounded hover:bg-red-700 text-sm">Consultar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuperAdminPanel;