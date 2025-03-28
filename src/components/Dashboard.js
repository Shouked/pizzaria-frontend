// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = ({ user }) => {
  const { primaryColor } = useTheme();
  const [tenant, setTenant] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  const fetchMyTenant = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/tenants/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTenant(res.data);
      setForm({
        name: res.data.name || '',
        phone: res.data.phone || '',
        address: {
          cep: res.data.address?.cep || '',
          street: res.data.address?.street || '',
          number: res.data.address?.number || ''
        }
      });
    } catch (err) {
      console.error('Erro ao carregar pizzaria:', err);
      toast.error('Erro ao carregar informações da pizzaria.');
    }
  };

  useEffect(() => {
    if (user?.isAdmin && !user?.isSuperAdmin) {
      fetchMyTenant();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['cep', 'street', 'number'].includes(name)) {
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/tenants/${tenant.tenantId}/me`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Informações atualizadas com sucesso!');
      setEditMode(false);
      fetchMyTenant();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar alterações.');
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: tenant.name || '',
      phone: tenant.phone || '',
      address: {
        cep: tenant.address?.cep || '',
        street: tenant.address?.street || '',
        number: tenant.address?.number || ''
      }
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
        Painel do Administrador
      </h1>

      {!tenant ? (
        <p className="text-gray-500">Carregando dados da pizzaria...</p>
      ) : (
        <div className="bg-white shadow p-4 rounded space-y-4">
          {editMode ? (
            <>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Nome da pizzaria"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Telefone"
              />
              <input
                name="cep"
                value={form.address.cep}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="CEP"
              />
              <input
                name="street"
                value={form.address.street}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Rua"
              />
              <input
                name="number"
                value={form.address.number}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Número"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Salvar</button>
                <button onClick={handleCancel} className="bg-gray-300 text-black px-4 py-2 rounded">Cancelar</button>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{tenant.name}</p>
                <p className="text-sm text-gray-500">{tenant.tenantId}</p>
                <p className="text-sm text-gray-600 mt-1">{tenant.phone || '-'}</p>
                <p className="text-sm text-gray-600">{tenant.address?.cep || '-'} | {tenant.address?.street || '-'}, {tenant.address?.number || '-'}</p>
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="bg-[#e63946] text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Editar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;