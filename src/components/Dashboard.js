import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import CreatePizzaria from './admin/CreatePizzaria';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { primaryColor } = useTheme();
  const [tenants, setTenants] = useState([]);
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
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
        <ul className="space-y-3">
          {tenants.map((tenant) => (
            <li
              key={tenant.tenantId}
              className="p-4 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{tenant.name}</p>
                <p className="text-sm text-gray-500">{tenant.tenantId}</p>
              </div>
              {tenant.logoUrl && (
                <img src={tenant.logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;