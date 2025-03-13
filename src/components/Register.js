import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setIsRegisterOpen, setIsLoggedIn, setUser, setCredentials }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [complement, setComplement] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://pizzaria-backend-e254.onrender.com/api/auth/register', {
        name,
        phone,
        address,
        complement,
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setUser({ name, phone, address, complement });
      setCredentials({ email, password });
      setIsLoggedIn(true);
      setIsRegisterOpen(false);
    } catch (err) {
      console.error('Erro de registro:', err.response?.data || err.message); // Depuração
      setError(err.response?.data?.message || 'Erro ao cadastrar. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white p-4 rounded-lg w-11/12 md:w-1/3 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#e63946] mb-3">Cadastro</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Endereço</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Complemento (ex.: Apto 03)</label>
            <input
              type="text"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
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
              minLength="6"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
          >
            Cadastrar
          </button>
          <button
            type="button"
            onClick={() => setIsRegisterOpen(false)}
            className="mt-2 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition text-sm"
          >
            Fechar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;