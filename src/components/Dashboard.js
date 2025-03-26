// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { primaryColor } = useTheme();
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const fetchTenants = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Token não encontrado');
        return;
      }

      try {
        const res = await api.get('/tenants', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTenants(res.data);
      } catch (err) {
        console.error('Erro ao carregar tenants:', err);
        toast.error('Erro ao carregar pizzarias');
      }
    };

    fetchTenants();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
        Painel do Super Admin
      </h1>

      {tenants.length === 0 ? (
        <p className="text-gray-600">Nenhuma pizzaria cadastrada ainda.</p>
      ) : (
        <ul className="space-y-3">
          {tenants.map((tenant) => (
            <li key={tenant._id} className="p-4 bg-white rounded shadow">
              <p className="font-bold text-lg">{tenant.name}</p>
              <p className="text-sm text-gray-500">Tenant ID: {tenant.tenantId}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;