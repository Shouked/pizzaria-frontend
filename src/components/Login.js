// src/components/Login.js
import React, { useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const Login = ({ setIsLoginOpen, setIsLoggedIn, setUser, navigate }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { tenantId } = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/auth/${tenantId}/login`, formData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsLoggedIn(true);
      setIsLoginOpen(false);
      navigate(`/${tenantId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" onChange={handleChange} required placeholder="Email" />
        <input type="password" name="password" onChange={handleChange} required placeholder="Senha" />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
