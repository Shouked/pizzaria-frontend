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
import SuperAdminPanel from './components/SuperAdminPanel';

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
    if (token && !user) fetchUserData(token);
    else if (!token && user) {
      setUser(null);
      setIsLoggedIn(false);
    }

    if (user && user.tenantId && currentTenantId && user.tenantId !== currentTenantId) {
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

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {isLoginOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 max-w-md max-h-[80vh] overflow-y-auto">
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
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
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

        <main className="flex-1 pb-20">
          <Routes>
            <Route path="/" element={user?.isSuperAdmin
              ? <SuperAdminPanel />
              : user?.isAdmin
              ? <Admin user={user} setIsLoginOpen={setIsLoginOpen} />
              : <div className="flex justify-center items-center h-full" />} />
            <Route path="/:tenantId" element={<Menu cart={cart} setCart={setCart} setIsLoginOpen={setIsLoginOpen} />} />
            <Route path="/:tenantId/order-summary" element={<OrderSummary user={user} setIsLoginOpen={setIsLoginOpen} cart={cart} setCart={setCart} />} />
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

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover theme="light" />
      </div>
    </ThemeProvider>
  );
}

export default App;
