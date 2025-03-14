import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setIsRegisterOpen, setIsLoginOpen, setIsLoggedIn, setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    complement: '', // Campo opcional
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await axios.post('https://pizzaria-backend-e254.onrender.com/api/auth/register', {
        name: formData.name,
        phone: formData.phone,
        address: {
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          neighborhood: formData.neighborhood,
          city: formData.city,
          complement: formData.complement || undefined, // Opcional
        },
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsLoggedIn(true);
      setIsRegisterOpen(false);
      alert('Cadastro realizado com sucesso!');
    } catch (err) {
      console.error('Erro ao cadastrar:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsRegisterOpen(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-xl font-bold text-[#e63946] mb-3">Cadastrar</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Telefone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">CEP</label>
          <input
            type="text"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Rua</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Número</label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Bairro</label>
          <input
            type="text"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cidade</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Complemento (Opcional)</label>
          <input
            type="text"
            name="complement"
            value={formData.complement}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
          >
            Cadastrar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterOpen(false);
              setIsLoginOpen(true);
            }}
            className="ml-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition text-sm"
          >
            Voltar para Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
