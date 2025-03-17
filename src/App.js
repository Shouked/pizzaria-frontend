import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from './components/Menu';
import OrderSummary from './components/OrderSummary';
import Orders from './components/Orders';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';

function App() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

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
    setCart([]);
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f1faee] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md w-full">
        <div className="relative w-full h-36 sm:h-40 md:h-48">
          <img
            src="/pizza.png"
            alt="Banner da Pizzaria"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#e63946] text-xl font-bold md:text-2xl bg-white bg-opacity-80 px-4 py-2 rounded-lg">
              Pizza da Bia
            </span>
          </div>
        </div>
      </header>

      {/* Modais */}
      {isLoginOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsLoginOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-11/12 max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Login
              setIsLoginOpen={setIsLoginOpen}
              setIsLoggedIn={setIsLoggedIn}
              setIsRegisterOpen={setIsRegisterOpen}
              setUser={setUser}
              cart={cart}
              navigate={navigate}
            />
          </div>
        </div>
      )}

      {isRegisterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsRegisterOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-11/12 max-w-lg max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Register
              setIsRegisterOpen={setIsRegisterOpen}
              setIsLoginOpen={setIsLoginOpen}
              setIsLoggedIn={setIsLoggedIn}
              setUser={setUser}
            />
          </div>
        </div>
      )}

      {isProfileOpen && isLoggedIn && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-11/12 max-w-lg max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Profile
              user={user}
              setIsProfileOpen={setIsProfileOpen}
              handleLogout={handleLogout}
              navigate={navigate}
            />
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Menu cart={cart} setCart={setCart} />} />
          <Route
            path="/order-summary"
            element={<OrderSummary cart={cart} clearCart={() => setCart([])} user={user} />}
          />
          <Route
            path="/orders"
            element={<Orders user={user} setIsLoginOpen={setIsLoginOpen} />}
          />
        </Routes>
      </main>

      {/* Navegação Inferior */}
      <nav className="bg-white p-2 shadow-md fixed bottom-0 left-0 w-full z-50 border-t border-gray-200">
        <div className="container mx-auto flex justify-around">
          <button
            onClick={() => navigate('/')}
            className="text-[#e63946] hover:text-red-700 flex flex-col items-center text-xs focus:outline-none"
            aria-label="Home"
          >
            <svg
              className="h-6 w-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="text-[#e63946] hover:text-red-700 flex flex-col items-center text-xs focus:outline-none"
            aria-label="Pedidos"
          >
            <svg
              className="h-6 w-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Pedidos
          </button>
          <button
            onClick={() => (isLoggedIn ? setIsProfileOpen(true) : setIsLoginOpen(true))}
            className="text-[#e63946] hover:text-red-700 flex flex-col items-center text-xs focus:outline-none"
            aria-label="Perfil"
          >
            <svg
              className="h-6 w-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Perfil
          </button>
          <button
            onClick={() => navigate('/order-summary')}
            className="text-[#e63946] hover:text-red-700 flex flex-col items-center text-xs focus:outline-none"
            aria-label="Carrinho"
          >
            <svg
              className="h-6 w-6 mb-1"
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
            Carrinho
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#e63946] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Botão WhatsApp */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition z-50 md:bottom-24"
        aria-label="Contato via WhatsApp"
      >
        <svg
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.56 4.22 1.628 6.045l-1.052 3.955 4.035-1.054A11.963 11.963 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.626 17.262c-.279.279-.652.443-1.045.443-.392 0-.765-.164-1.045-.443-.559-.559-.559-1.467 0-2.026l.279-.279c.559-.559 1.467-.559 2.026 0l.837.837c.558.558.558 1.467 0 2.026zm-5.626-5.626c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2zm-5-8.262c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1zm9 9c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1z" />
        </svg>
      </a>
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
