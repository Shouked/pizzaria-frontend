import React, { useState } from 'react';
import axios from 'axios';

const Profile = ({ user, handleLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMessage('');
    if (isEditing) {
      setEditedUser({ name: user.name, email: user.email, phone: user.phone || '' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'https://pizzaria-backend-e254.onrender.com/api/auth/me',
        editedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      user.name = response.data.name;
      user.email = response.data.email;
      user.phone = response.data.phone;
      setIsEditing(false);
      setMessage('Alterações salvas com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setMessage('Erro ao salvar alterações.');
    }
  };

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'https://pizzaria-backend-e254.onrender.com/api/auth/password',
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsChangingPassword(false);
      setNewPassword('');
      setMessage('Senha alterada com sucesso!');
    } catch (err) {
      console.error('Erro ao alterar senha:', err);
      setMessage('Erro ao alterar senha.');
    }
  };

  if (!user) return <div className="text-center p-4">Carregando...</div>;

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfil</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Mensagem de Sucesso/Erro */}
        {message && (
          <div className="mb-4 p-2 text-center text-white bg-green-500 rounded">
            {message}
          </div>
        )}

        {/* Informações do Usuário */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Nome</label>
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
            <label className="block text-gray-700 font-semibold">Email</label>
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
            <label className="block text-gray-700 font-semibold">Telefone</label>
            <input
              type="text"
              name="phone"
              value={editedUser.phone || 'Não informado'}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100 disabled:bg-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={showPassword ? 'Senha visível' : '*****'}
                disabled
                className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={showPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z'}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="mt-6 space-y-4">
          {!isEditing && !isChangingPassword && (
            <>
              <button
                onClick={handleEditToggle}
                className="w-full bg-[#e63946] text-white p-2 rounded hover:bg-red-700 transition"
              >
                Editar Perfil
              </button>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition"
              >
                Alterar Senha
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition flex items-center justify-center gap-2"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sair
              </button>
            </>
          )}

          {isEditing && (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
              >
                Salvar
              </button>
              <button
                onClick={handleEditToggle}
                className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
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
                  className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
