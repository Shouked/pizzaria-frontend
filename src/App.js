import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from './components/Menu';
import OrderSummary from './components/OrderSummary';
import Login from './components/Login'; // Certifique-se de que o Login.js existe

function App() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  // Carregar usuário ao iniciar, se houver token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      fetchUserData(token);
    }
  }, [user]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (err) {
      console.error('Erro ao carregar dados do usuário:', err);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setCart([]); // Esvaziar o carrinho
    navigate('/'); // Redirecionar para a home
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post('https://pizzaria-backend-e254.onrender.com/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsLoggedIn(true);
      setIsLoginOpen(false);
      if (cart.length > 0) {
        navigate('/order-summary'); // Redirecionar para o resumo se o carrinho tiver itens
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err.response?.data || err.message);
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f1faee]">
      {/* Barra Superior com Botão do Carrinho */}
      <header className="bg-[#e63946] p-4 fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate('/')}
              className="text-white text-2xl font-bold focus:outline-none"
            >
              Pizza da Bia
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-white hover:text-gray-200"
            >
              Cardápio
            </button>
            {isLoggedIn ? (
              <>
                <span className="text-white">Bem-vindo, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-200"
                >
                  Sair
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-white hover:text-gray-200"
              >
                Perfil
              </button>
            )}
            {/* Botão do Carrinho no canto direito */}
            <button
              onClick={() => navigate('/order-summary')}
              className="relative text-white hover:text-gray-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#e63946] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Modal de Login */}
      {isLoginOpen && (
        <Login
          setIsLoginOpen={setIsLoginOpen}
          setIsLoggedIn={setIsLoggedIn}
          setUser={setUser}
          handleLogin={handleLogin}
        />
      )}

      {/* Conteúdo Principal */}
      <div className="pt-16"> {/* Ajuste para evitar sobreposição com o header fixo */}
        <Routes>
          <Route
            path="/"
            element={<Menu cart={cart} setCart={setCart} />}
          />
          <Route
            path="/order-summary"
            element={<OrderSummary cart={cart} clearCart={() => setCart([])} user={user} />}
          />
        </Routes>
      </div>
    </div>
  );
}

// Componente Login embutido (se não houver Login.js separado)
const Login = ({ setIsLoginOpen, setIsLoggedIn, setUser, handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-11/12 md:w-1/3">
        <h2 className="text-xl font-bold text-[#e63946] mb-3">Login</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(email, password);
          }}
        >
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

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}