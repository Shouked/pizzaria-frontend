import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const { primaryColor } = useTheme();
  const [tenants, setTenants] = useState([]);
  const [viewingTenant, setViewingTenant] = useState(null);
  const [editingTenant, setEditingTenant] = useState(null);
  const [editForm, setEditForm] = useState({});
  const location = useLocation();

  const getTenantId = () => {
    const pathParts = location.pathname.split('/');
    return pathParts[1] || null;
  };

  const currentTenantId = getTenantId();

  const fetchTenant = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/tenants/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTenants([res.data]);
    } catch (err) {
      console.error('Erro ao carregar pizzaria:', err);
      toast.error('Erro ao carregar pizzaria.');
      // Fallback com dados do user
      if (user && user.tenantId === currentTenantId) {
        setTenants([{
          tenantId: user.tenantId,
          name: user.tenantName || 'Pizzaria do Admin',
          phone: user.phone || '',
          address: {
            cep: user.address?.cep || '',
            street: user.address?.street || '',
            number: user.address?.number || ''
          },
          logoUrl: '',
          primaryColor: '',
          secondaryColor: ''
        }]);
      }
    }
  };

  useEffect(() => {
    if (user && user.tenantId === currentTenantId) {
      fetchTenant();
    }
  }, [user, currentTenantId]);

  const startView = (tenant) => {
    setViewingTenant(tenant.tenantId);
    setEditingTenant(null);
    setEditForm({});
  };

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
      setViewingTenant(null);
      fetchTenant();
    } catch (err) {
      console.error('Erro ao atualizar pizzaria:', err);
      toast.error('Erro ao atualizar pizzaria. Apenas superadmins podem editar.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setEditForm(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
        Painel do Admin
      </h1>

      <h2 className="text-xl font-semibold mb-3">Sua Pizzaria</h2>

      {tenants.length === 0 ? (
        <p className="text-gray-500">Carregando ou nenhuma pizzaria associada.</p>
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
                  <input name="address.cep" value={editForm.address?.cep || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="CEP" />
                  <input name="address.street" value={editForm.address?.street || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Rua" />
                  <input name="address.number" value={editForm.address?.number || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Número" />
                  <input name="logoUrl" value={editForm.logoUrl || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="URL do Logo" />
                  <input name="primaryColor" value={editForm.primaryColor || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Cor Primária (ex: #e63946)" />
                  <input name="secondaryColor" value={editForm.secondaryColor || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Cor Secundária" />
                  <div className="flex gap-2 mt-2">
                    <button onClick={saveEdit} className="bg-green-500 text-white px-4 py-1 rounded">Salvar</button>
                    <button onClick={cancelEdit} className="bg-gray-300 text-black px-4 py-1 rounded">Cancelar</button>
                  </div>
                </div>
              ) : viewingTenant === tenant.tenantId ? (
                <div className="space-y-1">
                  <p><strong>Nome:</strong> {tenant.name}</p>
                  <p><strong>Tenant ID:</strong> {tenant.tenantId}</p>
                  <p><strong>Telefone:</strong> {tenant.phone || '-'}</p>
                  <p><strong>CEP:</strong> {tenant.address?.cep || '-'}</p>
                  <p><strong>Endereço:</strong> {tenant.address?.street || '-'}, {tenant.address?.number || '-'}</p>
                  <p><strong>Logo URL:</strong> {tenant.logoUrl || '-'}</p>
                  <p><strong>Cor Primária:</strong> {tenant.primaryColor || '-'}</p>
                  <p><strong>Cor Secundária:</strong> {tenant.secondaryColor || '-'}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => startEdit(tenant)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Editar</button>
                    <button onClick={cancelEdit} className="bg-gray-300 text-black px-3 py-1 rounded text-sm">Fechar</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{tenant.name}</p>
                    <p className="text-sm text-gray-500">{tenant.tenantId}</p>
                  </div>
                  <button onClick={() => startView(tenant)} className="bg-[#e63946] text-white px-3 py-1 rounded text-sm hover:bg-red-600">Consultar</button>
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
