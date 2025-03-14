import React, { useState } from 'react';
import axios from 'axios';

const Profile = ({ user, setIsProfileOpen, handleLogout, navigate }) => {
  const [editedUser, setEditedUser] = useState({ ...user });
  const [error, setError] = useState('');

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('https://pizzaria-backend-e254.onrender.com/api/auth/me', editedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(editedUser); // Atualizar o estado global (se possível no App.js)
      setIsProfileOpen(false);
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setError('Erro ao salvar perfil. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#e63946] mb-3">Perfil</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={editedUser.name || ''}
              onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={editedUser.email || ''}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={editedUser.password || ''}
              onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Deixe em branco para não alterar"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setIsProfileOpen(false)}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition text-sm"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition text-sm"
            >
              Sair
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
