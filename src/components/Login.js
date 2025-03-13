import React, { useState } from 'react';

const Login = ({ setIsLoginOpen, setIsLoggedIn, credentials, setIsRegisterOpen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!credentials) {
      setError('Nenhum usuário registrado. Por favor, cadastre-se.');
      return;
    }
    if (email === credentials.email && password === credentials.password) {
      setIsLoggedIn(true);
      setIsLoginOpen(false);
      setError('');
    } else {
      setError('Email ou senha incorretos.');
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
