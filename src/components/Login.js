
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const Login = ({ setIsLoginOpen, setIsLoggedIn, setUser, navigate }) => {
  const { tenantId } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      if (!tenantId) {
        console.error('TenantId não encontrado no login!');
        return;
      }

      const response = await api.post(`/auth/${tenantId}/login`, { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setUser(user);
      setIsLoggedIn(true);
      setIsLoginOpen(false);

      if (user.isAdmin) {
        navigate(`/${tenantId}/admin`);
      } else {
        navigate(`/${tenantId}/orders`);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
      <button onClick={() => setIsLoginOpen(false)}>Cancelar</button>
    </div>
  );
};

export default Login;
