import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user, setUser, handleLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      cep: user?.address?.cep || '',
      street: user?.address?.street || '',
      number: user?.address?.number || '',
      neighborhood: user?.address?.neighborhood || '',
      city: user?.address?.city || '',
      complement: user?.address?.complement || '',
    },
  });
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordPlaceholder, setShowPasswordPlaceholder] = useState(false);
  const navigate = useNavigate();

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedUser({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: { ...user.address },
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setEditedUser((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setEditedUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!window.confirm('Deseja realmente salvar as alterações?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'https://pizzaria-backend-e254.onrender.com/api/auth/me',
        editedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setIsEditing(false);
      navigate('/');
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      alert('Erro ao salvar alterações.');
    }
  };

  const handleCancelEdit = () => {
    if (!window.confirm('Deseja realmente cancelar as alterações?')) return;
    setEditedUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: { ...user.address },
    });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (!window.confirm('Deseja realmente alterar a senha?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'https://pizzaria-backend-e254.onrender.com/api/auth/password',
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsChangingPassword(false);
      setNewPassword('');
      navigate('/');
    } catch (err) {
      console.error('Erro ao alterar senha:', err);
      alert('Erro ao alterar senha.');
    }
  };

  const handleCancelPassword = () => {
    if (!window.confirm('Deseja realmente cancelar a alteração da senha?')) return;
    setIsChangingPassword(false);
    setNewPassword('');
  };

  if (!user) return <div className="text-center p-4">Carregando...</div>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg mt-4">
      <h2 className="text-2xl font-bold text-[#e63946] mb-6">Perfil</h2>
      <div className="space-y-4">
        <div>
          <strong>Nome:</strong>
          <input
            type="text"
            name="name"
            value={editedUser.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100 disabled:bg-gray-200"
          />
        </div>
        <div>
          <strong>Email:</strong>
          <input
            type="email"
            name="email"
            value={editedUser.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100 disabled:bg-gray-200"
          />
        </div>
        <div>
          <strong>Telefone:</strong>
          <input
            type="text"
            name="phone"
            value={editedUser.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100 disabled:bg-gray-200"
          />
        </div>
        <div>
          <strong>CEP:</strong>
          <input
            type="text"
            name="address.cep"
            value={editedUser.address.cep}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100 disabled:bg-gray-200"
          />
        </div>
        <div>
          <strong>Rua:</strong>
          <input
            type="text"
            name="address.street"
            value={editedUser.address.street}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100 disabled:bg-gray-200"
          />
        </div>
        <div>
          <strong>Número:</strong>
          <input
            type="text"
            name="address.number"
            value={editedUser.address.number}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100 disabled:bg-gray-200"
          />
        </div>
        <div>
          <strong>Bairro:</strong>
          <input
            type="text"
            name="address.neighborhood"
            value={editedUser.address.neighborhood}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100 disabled:bg-gray-200"
          />
        </div>
        <div>
          <strong>Cidade:</strong>
          <input
            type="text"
            name="address.city"
            value={editedUser.address.city}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100 disabled:bg-gray-200"
          />
        </div>
        <div>
          <strong>Complemento:</strong>
          <input
            type="text"
            name="address.complement"
            value={editedUser.address.complement || 'Não informado'}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100 disabled:bg-gray-200"
          />
        </div>
        <div>
          <strong>Senha:</strong>
          <div className="relative">
            <input
              type={showPasswordPlaceholder ? 'text' : 'password'}
              value={showPasswordPlaceholder ? '********' : '********'}
              disabled
              className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowPasswordPlaceholder(!showPasswordPlaceholder)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showPasswordPlaceholder ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z'} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {!isEditing && !isChangingPassword && (
          <>
            <button
              onClick={handleEditToggle}
              className="w-full bg-[#e63946] text-white py-2 rounded hover:bg-red-700 transition"
            >
              Editar Perfil
            </button>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
            >
              Alterar Senha
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4 -4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </>
        )}
        {isEditing && (
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
            >
              Salvar
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </div>
        )}
        {isChangingPassword && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold">Nova Senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleChangePassword}
                className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                Salvar
              </button>
              <button
                onClick={handleCancelPassword}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
