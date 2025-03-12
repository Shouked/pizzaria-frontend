import React from 'react';
import Menu from './components/Menu';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-[#e63946] text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/50"
            alt="Logo Pizzaria"
            className="h-12 rounded-full mr-3"
          />
          <h1 className="text-2xl font-bold font-sans">Pizzaria da Bia</h1>
        </div>
        <a
          href="https://wa.me/5511940705013"
          target="_blank"
          className="bg-green-500 px-5 py-2 rounded-full hover:bg-green-600 transition text-lg font-semibold"
        >
          Pedir no WhatsApp
        </a>
      </header>
      <div
        className="w-full h-72 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1513104890138-7c749659a680?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80)' }}
      ></div>
      <Menu />
    </div>
  );
}

export default App;
