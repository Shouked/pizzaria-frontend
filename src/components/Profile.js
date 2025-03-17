
import React, { useState } from 'react';
import axios from 'axios';

const Profile = ({ user, setIsProfileOpen, handleLogout, navigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('https://pizzaria-backend-e254.onrender.com/api/auth/me', editedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(editedUser); // Atualizar o estado global (se possível no App.js)
      setIsEditing(false);
      setIsProfileOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setError('Erro ao salvar perfil. Tente novamente.');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsProfileOpen(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-xl font-bold text-[#e63946] mb-3">Perfil</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {!isEditing ? (
        <div>
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Telefone:</strong> {user.phone}</p>
          <p><strong>Endereço:</strong> {user.address?.street}, {user.address?.number}, {user.address?.neighborhood}, {user.address?.city}, CEP: {user.address?.cep} {user.address?.complement ? `, Complemento: ${user.address.complement}` : ''}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="name"
              value={editedUser.name || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              name="phone"
              value={editedUser.phone || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">CEP</label>
            <input
              type="text"
              name="address.cep"
              value={editedUser.address?.cep || ''}
              onChange={(e) => handleChange({ target: { name: 'address.cep', value: e.target.value } })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Rua</label>
            <input
              type="text"
              name="address.street"
              value={editedUser.address?.street || ''}
              onChange={(e) => handleChange({ target: { name: 'address.street', value: e.target.value } })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Número</label>
            <input
              type="text"
              name="address.number"
              value={editedUser.address?.number || ''}
              onChange={(e) => handleChange({ target: { name: 'address.number', value: e.target.value } })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bairro</label>
            <input
              type="text"
              name="address.neighborhood"
              value={editedUser.address?.neighborhood || ''}
              onChange={(e) => handleChange({ target: { name: 'address.neighborhood', value: e.target.value } })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <input
              type="text"
              name="address.city"
              value={editedUser.address?.city || ''}
              onChange={(e) => handleChange({ target: { name: 'address.city', value: e.target.value } })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Complemento (Opcional)</label>
            <input
              type="text"
              name="address.complement"
              value={editedUser.address?.complement || ''}
              onChange={(e) => handleChange({ target: { name: 'address.complement', value: e.target.value } })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={editedUser.email || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              name="password"
              value={editedUser.password || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Deixe em branco para não alterar"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="mr-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
            >
              Salvar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
