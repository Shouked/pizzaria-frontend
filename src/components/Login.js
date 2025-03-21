import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const Login = ({ setIsLoginOpen, setIsLoggedIn, setIsRegisterOpen, setUser, cart, navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://pizzaria-backend-e254.onrender.com/api/auth/login', {
        email,
        password,
      });
      console.log('Resposta do backend:', response.data);
      const { token, user } = response.data;

      // Obtém o tenantId da URL atual
      const currentPath = window.location.pathname.split('/')[1];
      const currentTenantId = currentPath || 'pizzaria-a'; // Fallback para pizzaria-a se não houver tenantId na URL
      console.log('TenantId atual da URL:', currentTenantId);

      // Verifica se o tenantId do usuário corresponde ao tenantId atual
      const userTenantId = user.tenantId || 'pizzaria-a'; // Fallback caso o backend não retorne tenantId
      if (userTenantId !== currentTenantId) {
        throw new Error('Usuário não encontrado. Por favor, crie um login para esta pizzaria.');
      }

      // Se os tenantIds coincidirem, prossegue com o login
      localStorage.setItem('token', token);
      setUser(user);
      setIsLoggedIn(true);
      setIsLoginOpen(false);

      console.log('TenantId após login:', userTenantId);
      navigate(`/${userTenantId}`); // Redireciona para a página principal
      
      toast.success('Login realizado com sucesso!');
    } catch (err) {
      console.error('Erro no login:', err.response ? err.response.data : err.message);
      toast.error(err.message || err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-[#e63946] mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-[#e63946] hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginOpen(false);
              setIsRegisterOpen(true);
            }}
            className="text-[#e63946] hover:underline text-sm"
          >
            Não tem conta? Registre-se
          </button>
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  setIsLoginOpen: PropTypes.func.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
  setIsRegisterOpen: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  cart: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default Login;
