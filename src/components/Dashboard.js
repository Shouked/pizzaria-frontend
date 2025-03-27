import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import CreatePizzaria from './admin/CreatePizzaria';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { primaryColor } = useTheme();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTenantId, setEditingTenantId] = useState(null);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const startEdit = (tenant) => {
    setEditingTenantId(tenant.tenantId);
    setEditForm({
      name: tenant.name || '',
      logoUrl: tenant.logoUrl || '',
      phone: tenant.phone || '',
      address: {
        cep: tenant.address?.cep || '',
        street: tenant.address?.street || '',
        number: tenant.address?.number || '',
      },
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
        },
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const saveEdit = async (tenantId) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/tenants/${tenantId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Pizzaria atualizada com sucesso!');
      setEditingTenantId(null);
      fetchTenants();
    } catch (err) {
      console.error('Erro ao atualizar pizzaria:', err);
      toast.error('Erro ao salvar alterações.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
        Painel do Super Admin
      </h1>

      <CreatePizzaria onSuccess={fetchTenants} />

      <h2 className="text-xl font-semibold mb-3">Pizzarias cadastradas</h2>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : tenants.length === 0 ? (
        <p className="text-gray-500">Nenhuma pizzaria cadastrada.</p>
      ) : (
        <ul className="space-y-4">
          {tenants.map((tenant) => (
            <li key={tenant.tenantId} className="bg-white p-4 shadow rounded">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">{tenant.name}</p>
                  <p className="text-sm text-gray-500">{tenant.tenantId}</p>
                </div>
                {tenant.logoUrl && (
                  <img src={tenant.logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
                )}
              </div>

              {editingTenantId === tenant.tenantId ? (
                <div className="space-y-2 mt-3">
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    placeholder="Nome"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    name="logoUrl"
                    value={editForm.logoUrl}
                    onChange={handleEditChange}
                    placeholder="Logo URL"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    placeholder="Telefone"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    name="cep"
                    value={editForm.address.cep}
                    onChange={handleEditChange}
                    placeholder="CEP"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    name="street"
                    value={editForm.address.street}
                    onChange={handleEditChange}
                    placeholder="Rua"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    name="number"
                    value={editForm.address.number}
                    onChange={handleEditChange}
                    placeholder="Número"
                    className="w-full border p-2 rounded"
                  />

                  <div className="flex justify-end gap-3 mt-2">
                    <button
                      onClick={() => saveEdit(tenant.tenantId)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingTenantId(null)}
                      className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(tenant)}
                  className="mt-2 text-[#e63946] hover:underline text-sm"
                >
                  Consultar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;