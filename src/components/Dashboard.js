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
    if (!token) {
      toast.error('Token de autenticação não encontrado. Faça login novamente.');
      handleLogout();
      return;
    }

    try {
      if (user?.isSuperAdmin) {
        const res = await api.get('/tenants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTenants(Array.isArray(res.data) ? res.data : []);
      } else if (user?.isAdmin) {
        const res = await api.get('/tenants/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data) {
          throw new Error('Nenhum dado retornado para a pizzaria.');
        }
        setSingleTenant(res.data);
      }
    } catch (err) {
      console.error('Erro ao carregar pizzaria:', err);
      if (err.response) {
        // Erros específicos da API
        if (err.response.status === 403) {
          toast.error('Acesso negado. Verifique suas permissões.');
        } else if (err.response.status === 404) {
          toast.error('Pizzaria não encontrada.');
        } else {
          toast.error(`Erro ao carregar pizzaria: ${err.response.data?.message || 'Erro desconhecido'}`);
        }
      } else {
        toast.error('Erro ao conectar com o servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  if (!user) {
    return <p className="text-red-500">Usuário não autenticado.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
        Painel do {user.isSuperAdmin ? 'Super Admin' : 'Administrador'}
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4 hover:bg-red-600"
      >
        Sair
      </button>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : user.isSuperAdmin ? (
        <div>
          <p className="text-lg font-semibold mb-4">Pizzarias cadastradas:</p>
          <ul className="space-y-4">
            {tenants.map((tenant, index) => (
              <li key={tenant._id || index} className="bg-white p-4 rounded shadow">
                <p className="font-semibold">{tenant.name}</p>
                <p className="text-sm text-gray-600">/{tenant.tenantId}</p>
                <p className="text-sm text-gray-500">
                  {tenant.phone || '-'} | {tenant.address?.street || '-'},{' '}
                  {tenant.address?.number || '-'} - {tenant.address?.cep || '-'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : singleTenant ? (
        <div className="bg-white p-4 rounded shadow">
          <p className="text-lg font-semibold mb-2">{singleTenant.name}</p>
          <p className="text-sm text-gray-600">/{singleTenant.tenantId}</p>
          <p className="text-sm text-gray-500">
            {singleTenant.phone || '-'} | {singleTenant.address?.street || '-'},{' '}
            {singleTenant.address?.number || '-'} - {singleTenant.address?.cep || '-'}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Nenhuma informação da pizzaria disponível.</p>
      )}
    </div>
  );
};

export default Dashboard;