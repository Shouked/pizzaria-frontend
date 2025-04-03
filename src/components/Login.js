// src/components/Login.js import React, { useState } from 'react'; import api from '../services/api'; import { toast } from 'react-toastify'; import { useNavigate, useParams } from 'react-router-dom';

const Login = ({ setIsLoginOpen, setIsLoggedIn, setIsRegisterOpen, setUser, }) => { const [form, setForm] = useState({ email: '', password: '' }); const [loading, setLoading] = useState(false); const navigate = useNavigate(); const { tenantId } = useParams();

const handleChange = (e) => { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); };

const handleSubmit = async (e) => { e.preventDefault(); setLoading(true);

const url = tenantId
  ? `/auth/${tenantId}/login`
  : `/auth/superadmin/login`;

try {
  const res = await api.post(url, form);
  const { token, user } = res.data;

  localStorage.setItem('token', token);
  setUser(user);
  setIsLoggedIn(true);
  setIsLoginOpen(false);
  toast.success('Login realizado com sucesso!');

  if (user.isSuperAdmin) {
    navigate('/');
  } else {
    navigate(`/${user.tenantId}`);
  }
} catch (err) {
  console.error('Erro ao fazer login:', err);
  toast.error('Credenciais inválidas. Verifique seu e-mail e senha.');
} finally {
  setLoading(false);
}

};

return ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> <div className="bg-white rounded-lg shadow p-6 w-full max-w-sm"> <h2 className="text-xl font-bold mb-4 text-[#e63946]">Login</h2> <form onSubmit={handleSubmit} className="space-y-4"> <input
type="email"
name="email"
placeholder="Email"
value={form.email}
onChange={handleChange}
className="w-full border p-2 rounded"
required
/> <input
type="password"
name="password"
placeholder="Senha"
value={form.password}
onChange={handleChange}
className="w-full border p-2 rounded"
required
/> <button
type="submit"
disabled={loading}
className="w-full bg-[#e63946] text-white py-2 rounded hover:bg-red-700 transition"
> {loading ? 'Entrando...' : 'Entrar'} </button> </form> <div className="mt-4 text-sm text-center"> <span>Não tem conta? </span> <button onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} className="text-[#e63946] hover:underline" > Cadastre-se </button> </div> </div> </div> ); };

export default Login;

