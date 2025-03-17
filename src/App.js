import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Menu from './components/Menu';
import Orders from './components/Orders';
import Login from './components/Login';
import Cart from './components/Cart';

function App() {
  const [cart, setCart] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-[#e63946] p-4 flex justify-between items-center">
          <div className="text-white text-2xl font-bold">
            <Link to="/">Pizzaria</Link>
          </div>
          <div className="space-x-4">
            <Link to="/" className="text-white hover:underline">Menu</Link>
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="text-white hover:underline">Pedidos</Link>
                <Link to="/cart" className="text-white hover:underline">Carrinho ({cart.length})</Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:underline"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="text-white hover:underline">Login</Link>
            )}
          </div>
        </nav>
        <div className="w-screen left-0">
          <img
            src="/pizza.png"
            alt="Banner da Pizzaria"
            className="w-screen h-32 object-cover fixed top-0 z-10"
          />
        </div>
        <Routes>
          <Route path="/" element={<Menu cart={cart} setCart={setCart} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
