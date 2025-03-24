import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence, motion } from 'framer-motion';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import api from './services/api';

import Menu from './components/Menu';
import OrderSummary from './components/OrderSummary';
import Orders from './components/Orders';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Admin from './components/Admin';
import Dashboard from './components/Dashboard'; // ✅ Import do Dashboard

// Rota protegida
const ProtectedRoute = ({ user, children, setIsLoginOpen, tenantId }) => {
  const location = useLocation();

  if (!user && (location.pathname.includes('/orders') || location.pathname.includes('/profile'))) {
    setIsLoginOpen(true);
    return <Navigate to={`/${tenantId || ''}`} replace />;
  }

  return children;
};

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { primaryColor, logoUrl } = useTheme();

  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const tenantId = location.pathname.split('/')[1] || null;

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && !user) {
      fetchUser(token);
    }

    if (user && user.tenantId !== tenantId) {
      localStorage.removeItem('token');
      setUser(null);
      setCart([]);
    }

    if (location.pathname === '/' && !user && !isLoginOpen) {
      setIsLoginOpen(true);
    }
  }, [location.pathname, tenantId, user]);

  const fetchUser = async (token) => {
    try {
      const res = await api.get(`/auth/${tenantId}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart([]);
    navigate('/');
  };

  const NavigationBar = () => {
    if (!tenantId) return null;

    return (
      <nav className="bg-white p-2 shadow-md fixed bottom-0 left-0 w-full z-50 border-t border-gray-200">
        <div className="container mx-auto flex justify-around">
          <button
            onClick={() => navigate(`/${tenantId}`)}
            className="text-sm flex flex-col items-center"
            style={{ color: primaryColor }}
          >
            🏠 Home
          </button>
          <button
            onClick={() => navigate(`/${tenantId}/orders`)}
            className="text-sm flex flex-col items-center"
            style={{ color: primaryColor }}
          >
            📦 Pedidos
          </button>
          <button
            onClick={() => navigate(`/${tenantId}/profile`)}
            className="text-sm flex flex-col items-center"
            style={{ color: primaryColor }}
          >
            👤 Perfil
          </button>
          <button
            onClick={() => navigate(`/${tenantId}/order-summary`)}
            className="text-sm flex flex-col items-center"
            style={{ color: primaryColor }}
          >
            🛒 Carrinho
          </button>
        </div>
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-md w-full">
        <div className="relative w-full h-36 sm:h-40 md:h-48">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo da Pizzaria" className="w-full h-full object-contain p-4" />
          ) : (
            <img src="/pizza.png" alt="Banner da Pizzaria" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-xl font-bold md:text-2xl bg-white bg-opacity-80 px-4 py-2 rounded-lg"
              style={{ color: primaryColor }}
            >
              {tenantId ? `Pizzaria ${tenantId}` : 'Pizza da Bia'}
            </span>
          </div>
        </div>
      </header>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsLoginOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-11/12 max-w-md max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Login
                setIsLoginOpen={setIsLoginOpen}
                setIsRegisterOpen={setIsRegisterOpen}
                setUser={setUser}
                cart={cart}
                navigate={navigate}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REGISTER MODAL */}
      <AnimatePresence>
        {isRegisterOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsRegisterOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-11/12 max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Register
                setIsRegisterOpen={setIsRegisterOpen}
                setIsLoginOpen={setIsLoginOpen}
                setUser={setUser}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pb-16">
        <Routes>
          <Route
            path="/"
            element={
              user && user.isAdmin ? (
                <Admin user={user} />
              ) : (
                <div className="flex justify-center items-center h-full" />
              )
            }
          />
          <Route path="/:tenantId" element={<Menu cart={cart} setCart={setCart} setIsLoginOpen={setIsLoginOpen} />} />
          <Route
            path="/:tenantId/order-summary"
            element={<OrderSummary user={user} setIsLoginOpen={setIsLoginOpen} cart={cart} setCart={setCart} />}
          />
          <Route
            path="/:tenantId/orders"
            element={
              <ProtectedRoute user={user} setIsLoginOpen={setIsLoginOpen} tenantId={tenantId}>
                <Orders user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:tenantId/profile"
            element={
              <ProtectedRoute user={user} setIsLoginOpen={setIsLoginOpen} tenantId={tenantId}>
                <Profile user={user} handleLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route path="/:tenantId/admin" element={<Admin user={user} />} />
          <Route path="/:tenantId/admin/dashboard" element={<Dashboard user={user} />} /> {/* ✅ ROTA NOVA */}
        </Routes>
      </main>

      <NavigationBar />

      {/* BOTÃO WHATSAPP */}
      <a
        href="https://wa.me/+5511940705013"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition z-50"
        aria-label="Contato via WhatsApp"
      >
        📞
      </a>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  );
};

const App = () => (
  <Router>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </Router>
);

export default App;
