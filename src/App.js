import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Menu from './components/Menu';
import Register from './components/Register';
import Login from './components/Login';
import OrderSummary from './components/OrderSummary';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState({
    name: '',
    phone: '',
    address: '',
    complement: '',
  });
  const [credentials, setCredentials] = useState(null); // Armazena email e senha

  const navigate = useNavigate();

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setIsCartOpen(false);
      setIsLoginOpen(true);
    } else {
      setIsCartOpen(false);
      navigate('/order-summary');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleSaveProfile = (updatedUser) => {
    setUser(updatedUser);
    setIsProfileOpen(false);
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
    } else {
      setIsProfileOpen(true);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-[#e63946] text-white p-3 flex justify-between items-center shadow-md fixed w-full top-0 z-20">
        <div className="flex items-center">
          <img
            src="/favicon.ico"
            alt="Logo Pizzaria da Bia"
            className="h-8 rounded-full mr-2"
          />
          <h1 className="text-lg font-bold">Pizzaria da Bia</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-green-500 px-3 py-1 rounded-full hover:bg-green-600 transition text-sm font-semibold"
          >
            Sacola {cart.length > 0 && `(${cart.length})`}
          </button>
        </div>
      </header>

      <div
        className="w-full h-32 md:h-48 bg-cover bg-center mt-12 md:mt-0"
        style={{ backgroundImage: `url(/pizza.png)` }}
      ></div>

      <Routes>
        <Route path="/" element={<Menu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} addToCart={addToCart} cart={cart} />} />
        <Route path="/order-summary" element={<OrderSummary cart={cart} clearCart={clearCart} user={user} />} />
      </Routes>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-4 rounded-lg w-11/12 md:w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#e63946] mb-3">Sacola</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Sua sacola está vazia.</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold text-sm">{item.name || 'Item sem nome'}</p>
                      <p className="text-gray-600 text-xs">R$ {(item.price || 0).toFixed(2)}</p>
                    </div>
                    <p className="font-semibold text-sm">{item.quantity || 1}x</p>
                  </div>
                ))}
                <p className="text-base font-bold mt-3">
                  Total: R$ {cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0).toFixed(2)}
                </p>
                <button
                  onClick={handleCheckout}
                  className="mt-3 w-full bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
                >
                  Concluir Pedido
                </button>
                <button
                  onClick={clearCart}
                  className="mt-2 w-full bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
                >
                  Esvaziar Sacola
                </button>
              </>
            )}
            {cart.length === 0 ? (
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition text-sm"
              >
                Fechar
              </button>
            ) : (
              <Link
                to="/"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition text-sm block text-center"
              >
                Adicionar mais itens
              </Link>
            )}
          </div>
        </div>
      )}

      {isRegisterOpen && (
        <Register
          setIsRegisterOpen={setIsRegisterOpen}
          setIsLoggedIn={setIsLoggedIn}
          setUser={setUser}
          setCredentials={setCredentials}
        />
      )}

      {isLoginOpen && (
        <Login
          setIsLoginOpen={setIsLoginOpen}
          setIsLoggedIn={setIsLoggedIn}
          credentials={credentials}
          setIsRegisterOpen={setIsRegisterOpen}
        />
      )}

      {isProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-4 rounded-lg w-11/12 md:w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#e63946] mb-3">Perfil</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile({
                  name: e.target.name.value,
                  phone: e.target.phone.value,
                  address: e.target.address.value,
                  complement: e.target.complement.value,
                });
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={(e) => setUser({ ...user, address: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Complemento</label>
                <input
                  type="text"
                  name="complement"
                  value={user.complement}
                  onChange={(e) => setUser({ ...user, complement: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="mt-2 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition text-sm"
              >
                Fechar
              </button>
            </form>
          </div>
        </div>
      )}

      <a
        href="https://wa.me/5511940705013"
        target="_blank"
        className="fixed bottom-16 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition z-10 md:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.135.557 4.21 1.61 6.03L0 24l6.06-1.59A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.873 0-3.61-.49-5.13-1.34l-.36-.21-3.59.94.95-3.54-.21-.37A9.96 9.96 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.21-7.29c-.29-.15-1.72-.86-1.99-.96-.27-.1-.47-.15-.67.15-.2.29-.77.96-.95 1.15-.17.2-.34.21-.63.06-.29-.15-1.22-.45-2.32-1.44-1.1-.99-1.84-2.22-2.05-2.51-.21-.29-.02-.45.15-.67.15-.2.34-.51.49-.77.15-.25.07-.45-.03-.63-.1-.18-.45-.77-.63-1.06-.18-.29-.36-.25-.49-.25-.13 0-.27 0-.41 0-.14 0-.36.05-.55.25-.19.2-.72.67-.72 1.64 0 .97.74 1.91.84 2.05.1.14 1.46 2.23 3.54 3.13.49.21 1.05.34 1.41.43.59.14 1.13.12 1.55.07.47-.06 1.44-.58 1.64-1.14.2-.56.2-.96.14-1.05-.06-.1-.25-.15-.54-.3z"/>
        </svg>
      </a>

      <nav className="fixed bottom-0 w-full bg-white shadow-md flex justify-around py-2 z-20 md:hidden">
        <Link to="/" className="flex flex-col items-center text-gray-600">
          <svg
            className="h-5 w-5"
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
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/order-summary" className="flex flex-col items-center text-gray-600">
          <svg
            className="h-5 w-5"
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
          <span className="text-xs">Pedidos</span>
        </Link>
        <button onClick={handleProfileClick} className="flex flex-col items-center text-gray-600">
          <svg
            className="h-5 w-5"
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
          <span className="text-xs">Perfil</span>
        </button>
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
