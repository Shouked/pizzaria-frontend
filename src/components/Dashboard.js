// Atualizado Dashboard.js com consulta, edição e campos completos
import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import CreatePizzaria from './admin/CreatePizzaria';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { primaryColor } = useTheme();
  const [tenants, setTenants] = useState([]);
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
      console.error('Erro ao carregar pizzarias:', err);
      toast.error('Erro ao carregar pizzarias.');
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const startEdit = (tenant) => {
    setEditingTenant(tenant.tenantId);
    setEditForm({ ...tenant });
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
      cancelEdit();
      fetchTenants();
    } catch (err) {
      console.error('Erro ao atualizar pizzaria:', err);
      toast.error('Erro ao atualizar pizzaria.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
        Painel do Super Admin
      </h1>

      <CreatePizzaria onSuccess={fetchTenants} />

      <h2 className="text-xl font-semibold mb-3">Pizzarias cadastradas</h2>

      {tenants.length === 0 ? (
        <p className="text-gray-500">Nenhuma pizzaria cadastrada.</p>
      ) : (
        <ul className="space-y-4">
          {tenants.map((tenant) => (
            <li
              key={tenant.tenantId}
              className="p-4 bg-white shadow rounded"
            >
              {editingTenant === tenant.tenantId ? (
                <div className="space-y-2">
                  <input name="name" value={editForm.name || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Nome" />
                  <input name="phone" value={editForm.phone || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Telefone" />
                  <input name="cep" value={editForm.cep || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="CEP" />
                  <input name="street" value={editForm.street || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Rua" />
                  <input name="number" value={editForm.number || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Número" />
                  <div className="flex gap-2 mt-2">
                    <button onClick={saveEdit} className="bg-green-500 text-white px-4 py-1 rounded">Salvar</button>
                    <button onClick={cancelEdit} className="bg-gray-300 text-black px-4 py-1 rounded">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{tenant.name}</p>
                    <p className="text-sm text-gray-500">{tenant.tenantId}</p>
                    <p className="text-sm text-gray-600">{tenant.phone || '-'} | {tenant.cep || '-'} | {tenant.street || '-'}, {tenant.number || '-'}</p>
                  </div>
                  <button onClick={() => startEdit(tenant)} className="bg-[#e63946] text-white px-3 py-1 rounded text-sm hover:bg-red-600">Consultar</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
