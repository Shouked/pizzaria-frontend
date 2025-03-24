
import React, { useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Login = ({ setIsLoginOpen, setIsLoggedIn, setIsRegisterOpen, setUser, cart, navigate }) => {
  const { tenantId } = useParams();
  const { primaryColor } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/auth/${tenantId}/login`, { email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setUser(res.data.user);
      setIsLoginOpen(false);
      navigate(`/${tenantId}`);
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
