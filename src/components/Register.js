import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Register = ({
  tenantId,
  setIsRegisterOpen,
  setIsLoginOpen,
  setIsLoggedIn,
  setUser
}) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tenantId) {
      toast.error('TenantId não encontrado. Volte e tente novamente.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(`/auth/${tenantId}/register`, form);
      toast.success('Cadastro realizado! Agora faça login.');
      setIsRegisterOpen(false);
      setIsLoginOpen(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Erro ao registrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-[#e63946]">Cadastro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Nome completo"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#e63946] text-white py-2 rounded hover:bg-red-700"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Já tem uma conta?{' '}
        <button
          onClick={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
          className="text-[#e63946] font-medium"
        >
          Faça login
        </button>
      </p>
    </div>
  );
};

export default Register;