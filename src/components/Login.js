import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Login = ({
  tenantId,
  setIsLoginOpen,
  setIsLoggedIn,
  setIsRegisterOpen,
  setUser,
  cart,
  navigate
}) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = tenantId
      ? `/${tenantId}/login`
      : `/superadmin/login`;

    try {
      const res = await api.post(`/auth${url}`, form);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      setUser(user);
      setIsLoggedIn(true);
      setIsLoginOpen(false);
      toast.success('Login realizado com sucesso!');

      if (user.isSuperAdmin) {
        navigate('/');
      } else if (user.isAdmin && tenantId) {
        navigate(`/${tenantId}/admin`);
      } else {
        navigate(`/${tenantId}`);
      }

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-[#e63946]">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Ainda não tem uma conta?{' '}
        <button
          onClick={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
          className="text-[#e63946] font-medium"
        >
          Cadastre-se
        </button>
      </p>
    </div>
  );
};

export default Login;