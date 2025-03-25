import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const Login = ({ setIsLoginOpen, setIsLoggedIn, setUser, navigate }) => {
  const { tenantId } = useParams(); // Captura o tenantId da URL
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      if (!tenantId) {
        toast.error('TenantId não encontrado.');
        return;
      }

      const response = await api.post(`/auth/${tenantId}/login`, { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setUser(user);
      setIsLoggedIn(true);
      setIsLoginOpen(false);

      toast.success('Login realizado com sucesso!');

      if (user.isAdmin) {
        navigate(`/${tenantId}/admin`);
      } else {
        navigate(`/${tenantId}/orders`);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Falha no login. Verifique seu email e senha.');
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Entrar</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded mb-2"
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded mb-4"
      />
      <button
        onClick={handleLogin}
        className="bg-[#e63946] text-white px-4 py-2 rounded w-full hover:bg-red-600"
      >
        Entrar
      </button>
      <button
        onClick={() => setIsLoginOpen(false)}
        className="bg-gray-300 text-black px-4 py-2 rounded w-full mt-2 hover:bg-gray-400"
      >
        Cancelar
      </button>
    </div>
  );
};

export default Login;