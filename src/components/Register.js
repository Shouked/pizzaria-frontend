// src/components/Register.js
import React, { useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const Register = ({ setIsRegisterOpen, setIsLoginOpen, setIsLoggedIn, setUser }) => {
  const { tenantId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem.');
      return;
    }

    try {
      const response = await api.post(`/auth/${tenantId}/register`, formData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsLoggedIn(true);
      setIsRegisterOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro no cadastro.');
    }
  };

  return (
    <div>
      <h2>Cadastrar</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange} required placeholder="Nome" />
        <input type="email" name="email" onChange={handleChange} required placeholder="Email" />
        <input type="password" name="password" onChange={handleChange} required placeholder="Senha" />
        <input type="password" name="confirmPassword" onChange={handleChange} required placeholder="Confirmar Senha" />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
