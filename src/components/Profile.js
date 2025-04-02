// src/components/Profile.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user, setUser, handleLogout }) => {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold text-[#e63946] mb-4">Perfil</h2>
        <p className="text-gray-600">Você precisa estar logado para ver seu perfil.</p>
      </div>
    );
  }

  const goToDashboard = () => {
    if (user?.tenantId) {
      navigate(`/${user.tenantId}/admin`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-[#e63946] mb-4">Meu Perfil</h2>

      <div className="space-y-3 text-gray-800">
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>

        {user.isSuperAdmin && (
          <p><strong>Tipo de Conta:</strong> Super Admin</p>
        )}

        {user.isAdmin && !user.isSuperAdmin && (
          <>
            <p><strong>Tipo de Conta:</strong> Administrador da pizzaria</p>
            <p><strong>Pizzaria (tenantId):</strong> {user.tenantId}</p>

            <button
              onClick={goToDashboard}
              className="mt-4 bg-[#e63946] text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
            >
              Acessar Painel do Administrador
            </button>
          </>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-all"
        >
          Sair da Conta
        </button>
      </div>
    </div>
  );
};

export default Profile;
