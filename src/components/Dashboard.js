import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = ({ user, handleLogout }) => {
  const { primaryColor } = useTheme();
  const [tenants, setTenants] = useState([]);
  const [singleTenant, setSingleTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      if (user?.isSuperAdmin) {
        const res = await api.get('/tenants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTenants(res.data);
      } else if (user?.isAdmin) {
        const res = await api.get('/tenants/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSingleTenant(res.data);
      }
    } catch (err) {
      console.error('Erro ao carregar pizzaria:', err);
      toast.error('Erro ao carregar pizzaria.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
        Painel do {user?.isSuperAdmin ? 'Super Admin' : 'Administrador'}
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4 hover:bg-red-600"
      >
        Sair
      </button>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : user?.isSuperAdmin ? (
        <div>
          <p className="text-lg font-semibold mb-4">Pizzarias cadastradas:</p>
          <ul className="space-y-4">
            {tenants.map((tenant) => (
              <li key={tenant._id} className="bg-white p-4 rounded shadow">
                <p className="font-semibold">{tenant.name}</p>
                <p className="text-sm text-gray-600">/{tenant.tenantId}</p>
                <p className="text-sm text-gray-500">{tenant.phone || '-'} | {tenant.address?.street || '-'}, {tenant.address?.number || '-'} - {tenant.address?.cep || '-'}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : singleTenant ? (
        <div className="bg-white p-4 rounded shadow">
          <p className="text-lg font-semibold mb-2">{singleTenant.name}</p>
          <p className="text-sm text-gray-600">/{singleTenant.tenantId}</p>
          <p className="text-sm text-gray-500">{singleTenant.phone || '-'} | {singleTenant.address?.street || '-'}, {singleTenant.address?.number || '-'} - {singleTenant.address?.cep || '-'}</p>
        </div>
      ) : (
        <p className="text-gray-500">Nenhuma informação da pizzaria disponível.</p>
      )}
    </div>
  );
};

export default Dashboard;