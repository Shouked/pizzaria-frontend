// src/components/Profile.js
import React from 'react';

const Profile = ({ user, setUser, handleLogout }) => {
  if (!user) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold text-[#e63946] mb-4">Perfil</h2>
        <p className="text-gray-600">Você precisa estar logado para ver seu perfil.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#e63946] mb-4">Meu Perfil</h2>
      <div className="space-y-2 text-gray-800">
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Admin:</strong> {user.isAdmin ? 'Sim' : 'Não'}</p>
        <p><strong>Pizzaria:</strong> {user.tenantId}</p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 bg-[#e63946] text-white px-6 py-2 rounded hover:bg-red-600 transition"
      >
        Sair da conta
      </button>
    </div>
  );
};

export default Profile;