// src/components/Profile.js
import React, { useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const Profile = ({ user, setUser, handleLogout }) => {
  const { tenantId } = useParams();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await api.put(`/user/${tenantId}/users/${user._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      alert('Perfil atualizado!');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
    }
  };

  return (
    <div>
      <h2>Meu Perfil</h2>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nome"
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <button onClick={handleSave}>Salvar</button>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
};

export default Profile;
