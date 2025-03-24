
import React, { useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Register = ({ setIsRegisterOpen, setIsLoginOpen, setIsLoggedIn, setUser }) => {
  const { tenantId } = useParams();
  const { primaryColor } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/auth/${tenantId}/register`, { name, email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setUser(res.data.user);
      setIsRegisterOpen(false);
    } catch (err) {
      console.error('Erro no registro:', err);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>Registrar</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
