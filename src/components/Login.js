import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Login = ({ setIsLoginOpen, setIsLoggedIn, setIsRegisterOpen, setUser, cart, navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { tenantId } = useParams(); // Pega o tenantId da rota atual

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://pizzaria-backend-e254.onrender.com/api/auth/login', {
        email,
        password,
      });
      console.log('Resposta do login:', response.data);
      localStorage.setItem('token', response.data.token);

      const userResponse = await axios.get('https://pizzaria-backend-e254.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });
      console.log('Dados completos do usuário:', userResponse.data);
      setUser(userResponse.data);
      setIsLoggedIn(true);
      setIsLoginOpen(false);

      // Redireciona com base no tenantId e no carrinho
      const basePath = tenantId ? `/${tenantId}` : '/pizzaria-a'; // Default para pizzaria-a se não houver tenantId
      if (cart && cart.length > 0) {
        navigate(`${basePath}/order-summary`);
      } else {
        navigate(basePath);
      }
    } catch (err) {
      console.error('Erro no login:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white p-4 rounded-lg w-11/12 md:w-1/3 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#e63946] mb-3">Login</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginOpen(false);
              setIsRegisterOpen(true);
            }}
            className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition text-sm"
          >
            Cadastrar
          </button>
          <button
            type="button"
            onClick={() => setIsLoginOpen(false)}
            className="mt-2 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition text-sm"
          >
            Fechar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
