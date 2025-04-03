import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Menu from './components/Menu';
import OrderSummary from './components/OrderSummary';
import Orders from './components/Orders';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import SuperAdminPanel from './components/SuperAdminPanel';

import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ user, children, setIsLoginOpen }) => {
  const location = useLocation();

  if (!user) {
    setIsLoginOpen(true);
    return <div className="p-4 text-center text-gray-500">Carregando...</div>;
  }

  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const getTenantId = () => {
    const pathParts = location.pathname.split('/');
    return pathParts[1] || null;
  };

  const currentTenantId = getTenantId();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUserData(token);
    else {
      setIsLoggedIn(false);
      setUser(null);
      setCart([]);
    }
  }, [location.pathname]);

  const fetchUserData = async (token) => {
    try {
      const res = await axios.get('https://pizzaria-backend-e254.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Erro ao carregar dados do usuário:', err);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setCart([]);
    navigate(`/${currentTenantId}`);
  };

  const NavigationBar = () => {
    if (!currentTenantId || user?.isSuperAdmin) return null;
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
      <nav className="bg-white p-3 shadow-lg fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-gray-100">
        <div className="container mx-auto flex justify-around max-w-md">
          <button onClick={() => navigate(`/${currentTenantId}`)} className="text-[#e63946] flex flex-col items-center text-xs font-medium hover:text-red-700 transition">
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Início
          </button>
          <button onClick={() => navigate(`/${currentTenantId}/orders`)} className="text-[#e63946] flex flex-col items-center text-xs font-medium hover:text-red-700 transition">
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Pedidos
          </button>
          <button onClick={() => navigate(`/${currentTenantId}/profile`)} className="text-[#e63946] flex flex-col items-center text-xs font-medium hover:text-red-700 transition">
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Perfil
          </button>
          <button onClick={() => navigate(`/${currentTenantId}/summary`)} className="text-[#e63946] flex flex-col items-center text-xs font-medium hover:text-red-700 transition relative">
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Carrinho
            {cartCount > 0 && (
              <span className="absolute top-0 right-2 bg-[#e63946] text-white rounded-full text-[8px] w-4 h-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    );
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Routes>
          <Route path="/:tenantId" element={<Menu cart={cart} setCart={setCart} user={user} setIsLoginOpen={setIsLoginOpen} />} />
          <Route path="/:tenantId/summary" element={<OrderSummary cart={cart} setCart={setCart} user={user} setIsLoginOpen={setIsLoginOpen} />} />
          <Route path="/:tenantId/orders" element={<ProtectedRoute user={user} setIsLoginOpen={setIsLoginOpen}><Orders user={user} /></ProtectedRoute>} />
          <Route path="/:tenantId/profile" element={<ProtectedRoute user={user} setIsLoginOpen={setIsLoginOpen}><Profile user={user} setUser={setUser} handleLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/:tenantId/admin" element={<ProtectedRoute user={user} setIsLoginOpen={setIsLoginOpen}><Dashboard user={user} /></ProtectedRoute>} />
          <Route path="/" element={<SuperAdminPanel />} />
        </Routes>

        <NavigationBar />

        {isLoginOpen && <Login setIsLoginOpen={setIsLoginOpen} setIsRegisterOpen={setIsRegisterOpen} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />}
        {isRegisterOpen && <Register setIsRegisterOpen={setIsRegisterOpen} setIsLoginOpen={setIsLoginOpen} />}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover theme="light" />
      </div>
    </ThemeProvider>
  );
}

export default App;