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

const ProtectedRoute = ({ user, children, setIsLoginOpen, tenantId }) => {
  const location = useLocation();

  // Só abre o login se a rota for '/orders' ou '/profile' e o usuário não estiver logado
  if (!user && (location.pathname.includes('/orders') || location.pathname.includes('/profile'))) {
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
      // Reseta o usuário se o token for removido
      setUser(null);
      setIsLoggedIn(false);
    }

    // Reseta o login se o tenantId mudar
    if (user && user.tenantId && currentTenantId && user.tenantId !== currentTenantId) {
      console.log(`TenantId mudou de ${user.tenantId} para ${currentTenantId}. Resetando login.`);
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
      setCart([]);
    }

    // Fecha o modal de login se estiver aberto na página principal
    if (isLoginOpen && location.pathname === `/${currentTenantId}`) {
      setIsLoginOpen(false);
    }
  }, [location.pathname, user, isLoginOpen]); // Adicionei isLoginOpen para reagir a mudanças

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      console.log('Usuário carregado:', response.data);
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
    const tenantId = currentTenantId;
    if (!tenantId) return null;

    return (
      <nav className="bg-white p-2 shadow-md fixed bottom-0 left-0 w-full z-50 border-t border-gray-200">
        <div className="container mx-auto flex justify-around">
          <button
            onClick={() => navigate(`/${tenantId}`)}
            className="text-[#e63946] hover:text-red-700 flex flex-col items-center text-xs focus:outline-none"
            aria-label="Home"
          >
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
          <button
            onClick={() => navigate(`/${tenantId}/orders`)}
            className="text-[#e63946] hover:text-red-700 flex flex-col items-center text-xs focus:outline-none"
            aria-label="Pedidos"
          >
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Pedidos
          </button>
          <button
            onClick={() => navigate(`/${tenantId}/profile`)}
            className="text-[#e63946] hover:text-red-700 flex flex-col items-center text-xs focus:outline-none"
            aria-label="Perfil"
          >
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Perfil
          </button>
          <button
            onClick={() => navigate(`/${tenantId}/order-summary`)}
            className="text-[#e63946] hover:text-red-700 flex flex-col items-center text-xs focus:outline-none relative"
            aria-label="Carrinho"
          >
            <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Carrinho
          </button>
        </div>
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-[#f1faee] flex flex-col">
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

      <main className="flex-1 pb-16">
        <Routes>
          <Route
            path="/"
            element={
              user && user.isAdmin ? (
                <Admin user={user} setIsLoginOpen={setIsLoginOpen} />
              ) : (
                <div className="flex justify-center items-center h-full">
                  {!isLoginOpen && !user && setIsLoginOpen(true)}
                </div>
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
              <ProtectedRoute user={user} setIsLoginOpen={setIsLoginOpen} tenantId={currentTenantId}>
                <Orders user={user} setIsLoginOpen={setIsLoginOpen} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:tenantId/profile"
            element={
              <ProtectedRoute user={user} setIsLoginOpen={setIsLoginOpen} tenantId={currentTenantId}>
                <Profile user={user} setUser={setUser} handleLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <NavigationBar />

      <a
        href="https://wa.me/+5511940705013"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition z-50 md:bottom-24"
        aria-label="Contato via WhatsApp"
      >
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.15-1.255-.463-2.39-1.475-.883-.812-1.48-1.214-1.63-1.39-.057-.074-.138-.216-.138-.292 0-.075.074-.148.223-.347.149-.198.298-.496.446-.744.149-.247.074-.496-.074-.744-.173-.297-.767-.964-1.065-1.31-.297-.348-.669-.347-.967-.347h-.668c-.198 0-.52.074-.792.446-.272.371-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.708.306 1.263.489 1.694.625.522.173 1.04.148 1.435.074.446-.099 1.364-.446 1.56-.842.198-.397.197-.744.148-.992-.05-.247-.173-.347-.47-.496zm-5.422 6.61h-.002a9.858 9.858 0 01-4.972-1.354l-.356-.211-3.698.957.964-3.62-.229-.38a9.866 9.866 0 01-1.51-5.26 9.916 9.916 0 019.917-9.916 9.878 9.878 0 017.01 2.9 9.864 9.864 0 012.904 7.01c0 5.51-4.492 9.917-10.028 9.917zm6.03-16.66A11.85 11.85 0 0012.05 0C5.495 0 .466 5.026 .466 11.583c0 2.092.552 4.14 1.593 5.926l-1.737 6.517 6.674-1.732a11.908 11.908 0 005.604 1.427h.005c6.555 0 11.584-5.026 11.584-11.583a11.8 11.8 0 00-3.51-8.44z" />
        </svg>
      </a>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  );
}

export default App;