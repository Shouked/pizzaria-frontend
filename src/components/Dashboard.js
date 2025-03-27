import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const Dashboard = ({ user }) => { // Recebe user como prop
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

  useEffect(() => {
    if (user && user.tenantId === currentTenantId) {
      // Usa os dados do user temporariamente até corrigir o backend
      setTenants([{
        tenantId: user.tenantId,
        name: user.tenantName || 'Pizzaria do Admin', // Ajustar conforme dados reais do backend
        phone: user.phone || '',
        cep: user.address?.cep || '',
        street: user.address?.street || '',
        number: user.address?.number || ''
      }]);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
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
                  <input name="cep" value={editForm.cep || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="CEP" />
                  <input name="street" value={editForm.street || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Rua" />
                  <input name="number" value={editForm.number || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Número" />
                  <div className="flex gap-2 mt-2">
                    <button onClick={cancelEdit} className="bg-gray-300 text-black px-4 py-1 rounded">Cancelar</button>
                  </div>
                </div>
              ) : viewingTenant === tenant.tenantId ? (
                <div className="space-y-1">
                  <p><strong>Nome:</strong> {tenant.name}</p>
                  <p><strong>Tenant ID:</strong> {tenant.tenantId}</p>
                  <p><strong>Telefone:</strong> {tenant.phone || '-'}</p>
                  <p><strong>CEP:</strong> {tenant.cep || '-'}</p>
                  <p><strong>Endereço:</strong> {tenant.street || '-'}, {tenant.number || '-'}</p>
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
