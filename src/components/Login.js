// src/components/Login.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const Login = ({ setIsLoginOpen, setIsLoggedIn, setUser, navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { tenantId } = useParams(); // Captura tenantId da URL

  const handleLogin = async () => {
    try {
      if (!tenantId) {
        console.error('TenantId não encontrado no login!');
        alert('Erro: tenantId não encontrado.');
        return;
      }

      console.log('Tentando login para tenant:', tenantId);

      const response = await api.post(`/auth/${tenantId}/login`, {
        email,
        password
      });

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
      <h2 className="text-lg font-semibold mb-4">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        className="w-full border border-gray-300 p-2 rounded mb-2"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        className="w-full border border-gray-300 p-2 rounded mb-4"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded w-full mb-2 hover:bg-red-600"
      >
        Entrar
      </button>
      <button
        onClick={() => setIsLoginOpen(false)}
        className="bg-gray-300 text-black px-4 py-2 rounded w-full hover:bg-gray-400"
      >
        Cancelar
      </button>
    </div>
  );
};

export default Login;