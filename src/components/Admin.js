
import React from 'react';

const Admin = ({ user, setIsLoginOpen }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Bem-vindo, {user?.name}!</p>
      {/* Adicione recursos de admin aqui */}
    </div>
  );
};

export default Admin;
