
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Profile = ({ user, setUser, handleLogout }) => {
  const { primaryColor } = useTheme();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>Meu Perfil</h1>
      <div className="border p-4 rounded shadow mb-4">
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Sair</button>
    </div>
  );
};

export default Profile;
