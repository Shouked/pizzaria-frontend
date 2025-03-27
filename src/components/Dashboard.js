import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { primaryColor } = useTheme();
  const [tenants, setTenants] = useState([]);
  const [editingTenantId, setEditingTenantId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleEdit = (tenant) => {
    setEditingTenantId(tenant.tenantId);
    setEditData({
      name: tenant.name || '',
      logoUrl: tenant.logoUrl || '',
      phone: tenant.phone || '',
      cep: tenant.cep || '',
      street: tenant.street || '',
      number: tenant.number || '',
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/tenants/${editingTenantId}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Pizzaria atualizada com sucesso!');
      setEditingTenantId(null);
      fetchTenants();
    } catch (err) {
      console.error('Erro ao salvar alterações:', err);
      toast.error('Erro ao salvar alterações.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditingTenantId(null);
    setEditData({});
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
        Painel do Super Admin
      </h1>

      <h2 className="text-xl font-semibold mb-3">Pizzarias cadastradas</h2>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : tenants.length === 0 ? (
        <p className="text-gray-500">Nenhuma pizzaria cadastrada.</p>
      ) : (
        <ul className="space-y-4">
          {tenants.map((tenant) => (
            <li
              key={tenant.tenantId}
              className="p-4 bg-white shadow rounded"
            >
              {editingTenantId === tenant.tenantId ? (
                <div className="space-y-2">
                  <input name="name" value={editData.name} onChange={handleChange} placeholder="Nome" className="border p-2 w-full" />
                  <input name="logoUrl" value={editData.logoUrl} onChange={handleChange} placeholder="Logo URL" className="border p-2 w-full" />
                  <input name="phone" value={editData.phone} onChange={handleChange} placeholder="Telefone" className="border p-2 w-full" />
                  <input name="cep" value={editData.cep} onChange={handleChange} placeholder="CEP" className="border p-2 w-full" />
                  <input name="street" value={editData.street} onChange={handleChange} placeholder="Rua" className="border p-2 w-full" />
                  <input name="number" value={editData.number} onChange={handleChange} placeholder="Número" className="border p-2 w-full" />
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Salvar</button>
                    <button onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{tenant.name}</p>
                    <p className="text-sm text-gray-500">{tenant.tenantId}</p>
                  </div>
                  <button
                    onClick={() => handleEdit(tenant)}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Consultar
                  </button>
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