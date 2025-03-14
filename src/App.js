import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from './components/Menu';
import OrderSummary from './components/OrderSummary';
import Login from './components/Login';

function App() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#f1faee] flex flex-col">
      {/* Barra Superior com Nome e Botão do Carrinho */}
      <header className="bg-[#e63946] p-4 fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex-1 text-center">
            <span className="text-white text-2xl font-bold">Pizza da Bia</span>
          </div>
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
      </header>

      {/* Modal de Login */}
      {isLoginOpen && (
        <Login
          setIsLoginOpen={setIsLoginOpen}
          setIsLoggedIn={setIsLoggedIn}
          setIsRegisterOpen={setIsRegisterOpen}
          setUser={setUser}
          cart={cart}
          navigate={navigate}
        />
      )}

      {/* Conteúdo Principal */}
      <div className="pt-16 flex-1">
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

      {/* Barra de Navegação Inferior */}
      <nav className="bg-[#e63946] p-4 fixed bottom-0 left-0 w-full z-50">
        <div className="container mx-auto flex justify-around">
          <button
            onClick={() => navigate('/')}
            className="text-white hover:text-gray-200 flex flex-col items-center"
          >
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
          <button
            onClick={() => navigate('/order-summary')}
            className="text-white hover:text-gray-200 flex flex-col items-center"
          >
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Pedidos
          </button>
          <button
            onClick={() => (isLoggedIn ? handleLogout() : setIsLoginOpen(true))}
            className="text-white hover:text-gray-200 flex flex-col items-center"
          >
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {isLoggedIn ? 'Sair' : 'Perfil'}
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
