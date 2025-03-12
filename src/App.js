import React from 'react';
import Menu from './components/Menu';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-red-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pizzaria</h1>
        <a
          href="https://wa.me/5511940705013"
          target="_blank"
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          WhatsApp
        </a>
      </header>
      <div
        className="w-full h-64 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1513104890138-7c749659a680?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80)' }}
      ></div>
      <Menu />
    </div>
  );
}

export default App;
