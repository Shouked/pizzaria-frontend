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
import Admin from './components/Admin';
import Dashboard from './components/Dashboard';
import SuperAdminPanel from './components/SuperAdminPanel';

import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ user, children, setIsLoginOpen, tenantId }) => {
  const location = useLocation();
  if (!user && (
    location.pathname.includes('/orders') ||
    location.pathname.includes('/profile') ||
    location.pathname.includes('/admin'))
  ) {
    setIsLoginOpen(true);
    return <Navigate to={`/${tenantId || ''}`} replace />;
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

    if (location.pathname === '/' && !user && !isLoginOpen) {
      setIsLoginOpen(true);
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
    navigate('/');
  };

  const NavigationBar = () => {
    if (!currentTenantId || user?.isSuperAdmin) return null;
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
      <nav className="bg-white p-3 shadow-lg fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-gray-100">
        <div className="container mx-auto flex justify-around max-w-md">
          <button onClick={() => navigate(`/${currentTenantId}`)} className="text-[#e63946] flex flex-col items-center text-xs font-medium hover:text-red-700 transition">Início</button>
          <button onClick={() => navigate(`/${currentTenantId}/orders`)} className="text-[#e63946] flex flex-col items-center text-xs font-medium hover:text-red-700 transition">Pedidos</button>
          <button onClick={() => navigate(`/${currentTenantId}/profile`)} className="text-[#e63946] flex flex-col items-center text-xs font-medium hover:text-red-700 transition">Perfil</button>
          <button onClick={() => navigate(`/${currentTenantId}/order-summary`)} className="text-[#e63946] flex flex-col items-center text-xs font-medium hover:text-red-700 transition relative">
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