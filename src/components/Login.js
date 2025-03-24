import React, { useState } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const Login = ({ setIsLoginOpen, setIsRegisterOpen, setIsLoggedIn, setUser, cart, navigate: parentNavigate }) => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tenantId) {
      alert('Tenant ID não encontrado!');
      return;
    }

    try {
      const response = await api.post(`/auth/${tenantId}/login`, {
        email,
        password
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setUser(user);
      setIsLoginOpen(false);

      (parentNavigate || navigate)(`/${tenantId}`);
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Email ou senha inválidos!');
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded w-full">
          Entrar
        </button>
      </form>
      <p className="mt-4 text-sm">
        Não tem uma conta?{' '}
        <button onClick={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }} className="text-red-500 underline">Cadastre-se</button>
      </p>
    </div>
  );
};

export default Login;
