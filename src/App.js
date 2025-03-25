import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Menu from './components/Menu';
import OrderSummary from './components/OrderSummary';
import Orders from './components/Orders';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Admin from './components/Admin';
import Dashboard from './components/Dashboard';

// Context
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
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
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

    if (token && !user) {
      fetchUserData(token);
    } else if (!token && user) {
      setUser(null);
      setIsLoggedIn(false);
    }

    if (user && user.tenantId && currentTenantId && user.tenantId !== currentTenantId) {
      console.log(`TenantId mudou de ${user.tenantId} para ${currentTenantId}. Resetando login.`);
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
      setCart([]);
    }

    if (location.pathname === '/' && !user && !isLoginOpen) {
      setIsLoginOpen(true);
    }
  }, [location.pathname, user]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`https://pizzaria-backend-e254.onrender.com/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
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
    if (!currentTenantId) return null;

    return (
      <nav className="bg-white p-2 shadow-md fixed bottom-0 left-0 w-full z-50 border-t border-gray-200">
        <div className="container mx-auto flex justify-around">
          <button onClick={() => navigate(`/${currentTenantId}`)} className="text-[#e63946] flex flex-col items-center text-xs">
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
          <button onClick={() => navigate(`/${currentTenantId}/orders`)} className="text-[#e63946] flex flex-col items-center text-xs">
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Pedidos
          </button>
          <button onClick={() => navigate(`/${currentTenantId}/profile`)} className="text-[#e63946] flex flex-col items-center text-xs">
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Perfil
          </button>
          <button onClick={() => navigate(`/${currentTenantId}/order-summary`)} className="text-[#e63946] flex flex-col items-center text-xs">
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Carrinho
          </button>
        </div>
      </nav>
    );
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#f1faee] flex flex-col">
        <header className="bg-white shadow-md w-full">
          <div className="relative w-full h-36 sm:h-40 md:h-48">
            <img src="/pizza.png" alt="Banner da Pizzaria" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#e63946] text-xl font-bold md:text-2xl bg-white bg-opacity-80 px-4 py-2 rounded-lg">
                Pizza da Bia
              </span>
            </div>
          </div>
        </header>

        {isLoginOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-md max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <Login
                tenantId={currentTenantId}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <Register
                tenantId={currentTenantId}
                setIsRegisterOpen={setIsRegisterOpen}
                setIsLoginOpen={setIsLoginOpen}
                setIsLoggedIn={setIsLoggedIn}
                setUser={setUser}
              />
            </div>
          </div>
        )}

        <main className="flex-1 pb-16">
          <Routes>
            <Route
              path="/"
              element={user && user.isAdmin
                ? <Admin user={user} setIsLoginOpen={setIsLoginOpen} />
                : <div className="flex justify-center items-center h-full" />}
            />
            <Route path="/:tenantId" element={<Menu cart={cart} setCart={setCart} setIsLoginOpen={setIsLoginOpen} />} />
            <Route path="/:tenantId/order-summary" element={
              <OrderSummary user={user} setIsLoginOpen={setIsLoginOpen} cart={cart} setCart={setCart} />
            } />
            <Route path="/:tenantId/orders" element={
              <ProtectedRoute user={user} setIsLoginOpen={setIsLoginOpen} tenantId={currentTenantId}>
                <Orders user={user} setIsLoginOpen={setIsLoginOpen} />
              </ProtectedRoute>
            } />
            <Route path="/:tenantId/profile" element={
              <ProtectedRoute user={user} setIsLoginOpen={setIsLoginOpen} tenantId={currentTenantId}>
                <Profile user={user} setUser={setUser} handleLogout={handleLogout} />
              </ProtectedRoute>
            } />
            <Route path="/:tenantId/admin" element={
              <ProtectedRoute user={user} setIsLoginOpen={setIsLoginOpen} tenantId={currentTenantId}>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        <NavigationBar />

        <a href="https://wa.me/+5511940705013" target="_blank" rel="noopener noreferrer"
          className="fixed bottom-20 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition z-50 md:bottom-24">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 32 32">
            <path d="M16 .1a15.9 15.9 0 0 0-13.6 24L0 32l8.3-2.2A16 16 0 1 0 16 .1zm8.7 23.1c-.4 1.1-2.2 2-3.1 2.1-.8.1-1.7.4-5-.9-4.2-1.6-7-5.9-7.2-6.2-.2-.3-1.7-2.3-1.7-4.4s1.1-3.1 1.5-3.6c.4-.4 1-.6 1.3-.6h.9c.3 0 .7 0 1 .8s1.2 2.7 1.3 2.9c.1.2.2.4 0 .7s-.3.4-.5.7-.5.5-.7.6c-.2.2-.4.4-.2.8.2.4 1 1.5 2.2 2.5 1.5 1.3 2.7 1.6 3.1 1.8.4.2.6.2.8 0s.9-1.1 1.1-1.5c.2-.4.4-.3.7-.2s1.9.9 2.2 1c.3.1.5.2.6.3.1.1.1 1.1-.3 2.2z" />
          </svg>
        </a>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
      </div>
    </ThemeProvider>
  );
}

export default App;