// src/components/Register.js
import React, { useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = ({ setIsRegisterOpen, setIsLoginOpen, setIsLoggedIn, setUser }) => {
  const { tenantId } = useParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numeric = value.replace(/\D/g, '');
      const masked = numeric.replace(/^(\d{2})(\d{5})(\d{4}).*/, '$1 $2-$3').substring(0, 13);
      setForm({ ...form, phone: masked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleRegister = async () => {
    try {
      if (!tenantId) {
        toast.error('TenantId não encontrado.');
        return;
      }

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        tenantId,
        address: {
          street: form.street,
          number: form.number,
          neighborhood: form.neighborhood,
          city: form.city,
          state: form.state,
          zip: form.zip
        }
      };

      const res = await api.post(`/auth/register`, payload);

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      setUser(user);
      setIsLoggedIn(true);
      setIsRegisterOpen(false);
      toast.success('Conta criada com sucesso!');
      window.location.href = `/${tenantId}`;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro ao criar conta. Verifique os dados.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center text-[#e63946]">Criar Conta</h2>

      <input name="name" type="text" placeholder="Nome completo" value={form.name} onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2" />

      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2" />

      <input name="phone" type="text" placeholder="Telefone (ex: 11 94070-5013)" value={form.phone} onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2" />

      <input name="street" type="text" placeholder="Rua" value={form.street} onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2" />

      <input name="number" type="text" placeholder="Número" value={form.number} onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2" />

      <input name="neighborhood" type="text" placeholder="Bairro" value={form.neighborhood} onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2" />

      <input name="city" type="text" placeholder="Cidade" value={form.city} onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2" />

      <input name="state" type="text" placeholder="Estado (UF)" value={form.state} onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2" />

      <input name="zip" type="text" placeholder="CEP" value={form.zip} onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-2" />

      <input name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded mb-4" />

      <button onClick={handleRegister}
        className="bg-[#e63946] text-white px-4 py-2 rounded w-full mb-2 hover:bg-red-600 transition">
        Criar Conta
      </button>

      <button onClick={() => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
      }}
        className="text-sm text-[#e63946] hover:underline w-full text-center mt-1">
        Já tenho uma conta
      </button>
    </div>
  );
};

export default Register;