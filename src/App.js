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

  if (!user && (location.pathname.includes('/orders') || location.pathname.includes('/profile') || location.pathname.includes('/admin'))) {
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
            <span>Home</span>
          </button>
          <button onClick={() => navigate(`/${currentTenantId}/orders`)} className="text-[#e63946] flex flex-col items-center text-xs">
            <span>Pedidos</span>
          </button>
          <button onClick={() => navigate(`/${currentTenantId}/profile`)} className="text-[#e63946] flex flex-col items-center text-xs">
            <span>Perfil</span>
          </button>
          <button onClick={() => navigate(`/${currentTenantId}/order-summary`)} className="text-[#e63946] flex flex-col items-center text-xs">
            <span>Carrinho</span>
          </button>
        </div>
      </nav>
    );
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#f1faee] flex flex-col">
        {/* Header */}
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

        {/* Login Modal */}
        {isLoginOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-md max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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

        {/* Register Modal */}
        {isRegisterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <Register
                setIsRegisterOpen={setIsRegisterOpen}
                setIsLoginOpen={setIsLoginOpen}
                setIsLoggedIn={setIsLoggedIn}
                setUser={setUser}
              />
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
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

        {/* WhatsApp Button */}
        <a href="https://wa.me/+5511940705013" target="_blank" rel="noopener noreferrer"
          className="fixed bottom-20 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition z-50 md:bottom-24">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967..."></path>
          </svg>
        </a>

        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />
      </div>
    </ThemeProvider>
  );
}

export default App;
