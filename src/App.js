import React, { useState } from 'react';
import Menu from './components/Menu';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Cabeçalho */}
      <header className="bg-[#e63946] text-white p-4 flex justify-between items-center shadow-md fixed w-full top-0 z-20">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/40"
            alt="Logo Pizzaria"
            className="h-10 rounded-full mr-2"
          />
          <h1 className="text-xl font-bold">Pizzaria da Bia</h1>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden focus:outline-none"
        >
          <svg
            className="h-6 w-6"
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
          className="hidden md:block bg-green-500 px-4 py-2 rounded-full hover:bg-green-600 transition text-lg font-semibold relative"
        >
          Sacola {cart.length > 0 && `(${cart.length})`}
        </button>
      </header>

      {/* Banner */}
      <div
        className="w-full h-48 md:h-72 bg-cover bg-center mt-16 md:mt-0"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1513104890138-7c749659a680?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80)' }}
      ></div>

      {/* Conteúdo */}
      <Menu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        addToCart={addToCart}
        cart={cart}
      />

      {/* Modal da Sacola */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#e63946] mb-4">Sacola</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Sua sacola está vazia.</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-3">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-600 text-sm">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-semibold">{item.quantity}x</p>
                  </div>
                ))}
                <p className="text-lg font-bold mt-4">
                  Total: R$ {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                </p>
                <button
                  onClick={() => alert('Verificação de login aqui!')}
                  className="mt-4 w-full bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition"
                >
                  Concluir Pedido
                </button>
              </>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-4 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Botão WhatsApp Fixo (Mobile) */}
      <a
        href="https://wa.me/5511940705013"
        target="_blank"
        className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition z-10 md:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.135.557 4.21 1.61 6.03L0 24l6.06-1.59A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.873 0-3.61-.49-5.13-1.34l-.36-.21-3.59.94.95-3.54-.21-.37A9.96 9.96 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.21-7.29c-.29-.15-1.72-.86-1.99-.96-.27-.1-.47-.15-.67.15-.2.29-.77.96-.95 1.15-.17.2-.34.21-.63.06-.29-.15-1.22-.45-2.32-1.44-1.1-.99-1.84-2.22-2.05-2.51-.21-.29-.02-.45.15-.67.15-.2.34-.51.49-.77.15-.25.07-.45-.03-.63-.1-.18-.45-.77-.63-1.06-.18-.29-.36-.25-.49-.25-.13 0-.27 0-.41 0-.14 0-.36.05-.55.25-.19.2-.72.67-.72 1.64 0 .97.74 1.91.84 2.05.1.14 1.46 2.23 3.54 3.13.49.21 1.05.34 1.41.43.59.14 1.13.12 1.55.07.47-.06 1.44-.58 1.64-1.14.2-.56.2-.96.14-1.05-.06-.1-.25-.15-.54-.3z"/>
        </svg>
      </a>
    </div>
  );
}

export default App;