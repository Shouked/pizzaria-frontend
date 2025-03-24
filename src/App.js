import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
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

const NavigationBar = ({ tenantId, navigate }) => {
  if (!tenantId) return null;

  return (
    <>
      <nav className="bg-white p-2 shadow-md fixed bottom-0 left-0 w-full z-50 border-t border-gray-200">
        <div className="container mx-auto flex justify-around">
          <button onClick={() => navigate(`/${tenantId}`)} className="text-[#e63946] flex flex-col items-center text-xs">
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10h14V10l2 2m-2-2v10H5V10z" />
            </svg>
            Home
          </button>

          <button onClick={() => navigate(`/${tenantId}/orders`)} className="text-[#e63946] flex flex-col items-center text-xs">
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3.5a1 1 0 01.8.4l1.4 1.6H17a2 2 0 012 2v10a2 2 0 01-2 2z" />
            </svg>
            Pedidos
          </button>

          <button onClick={() => navigate(`/${tenantId}/profile`)} className="text-[#e63946] flex flex-col items-center text-xs">
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A12.066 12.066 0 0112 15c2.21 0 4.29.636 6.121 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Perfil
          </button>

          <button onClick={() => navigate(`/${tenantId}/order-summary`)} className="text-[#e63946] flex flex-col items-center text-xs relative">
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5m1.6 8L3 6m0 0l1.6 8M5 21a2 2 0 100-4 2 2 0 000 4zm14 0a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            Carrinho
          </button>
        </div>
      </nav>

      <a
        href="https://wa.me/+5511940705013"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition z-50 md:bottom-24"
        aria-label="Contato via WhatsApp"
      >
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.403 12.966a6.724 6.724 0 01-1.955-.3 6.59 6.59 0 01-1.73-.99c-.51-.39-.96-.84-1.35-1.35a6.668 6.668 0 01-.99-1.73 6.768 6.768 0 01-.3-1.955c0-.66.08-1.31.23-1.93a9.962 9.962 0 01.47-1.25c.16-.4.35-.78.58-1.15a10.264 10.264 0 011.15-.58 9.944 9.944 0 011.25-.47c.62-.15 1.27-.23 1.93-.23.66 0 1.31.08 1.93.23.43.09.85.22 1.25.38.4.17.78.36 1.15.58.37.23.72.48 1.05.75.33.27.65.56.94.87.29.31.56.63.8.97.24.34.46.69.65 1.06.2.37.37.76.51 1.16.14.4.24.82.31 1.24.07.43.1.86.1 1.3 0 .44-.03.87-.1 1.3a9.98 9.98 0 01-.31 1.24 9.93 9.93 0 01-.51 1.16 9.74 9.74 0 01-.65 1.06 9.7 9.7 0 01-.8.97c-.29.31-.61.6-.94.87-.33.27-.68.52-1.05.75a9.988 9.988 0 01-1.15.58 9.95 9.95 0 01-1.25.38c-.62.15-1.27.23-1.93.23a9.95 9.95 0 01-1.93-.23z" />
        </svg>
      </a>
    </>
  );
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

        <NavigationBar tenantId={currentTenantId} navigate={navigate} />

        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />
      </div>
    </ThemeProvider>
  );
}

export default App;
