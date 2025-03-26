import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Login = ({ setIsLoginOpen, setIsLoggedIn, setUser, navigate, tenantId, setIsRegisterOpen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      let response;
      // Se for um email de superadmin conhecido, usa a rota especial
      if (email === 'superadmin@admin.com') {
        response = await api.post('/auth/superadmin/login', { email, password });
      } else if (!tenantId) {
        toast.error('TenantId não encontrado.');
        return;
      } else {
        response = await api.post(`/auth/${tenantId}/login`, { email, password });
      }

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setIsLoggedIn(true);
      setIsLoginOpen(false);
      toast.success('Login realizado com sucesso!');
      if (user.isSuperAdmin) {
        navigate('/'); // Superadmins vão para a raiz
      } else if (user.isAdmin) {
        navigate(`/${tenantId}/admin`); // Admins normais vão para o dashboard
      } else {
        navigate(`/${tenantId}/orders`); // Usuários comuns vão para pedidos
      }
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      toast.error('Falha no login: ' + (error.response?.data?.msg || 'Verifique suas credenciais.'));
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
      <button
        onClick={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
        className="text-sm text-[#e63946] hover:underline w-full text-center mt-2"
      >
        Criar Conta
      </button>
    </div>
  );
};

export default Login;
