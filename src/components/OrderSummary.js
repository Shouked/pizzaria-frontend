import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Adicionei useNavigate para redirecionamento

const OrderSummary = ({ cart, clearCart }) => {
  const navigate = useNavigate(); // Hook para redirecionamento

  // Verifica se cart está definido e calcula o total
  const total = cart && cart.length > 0 
    ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2) 
    : 0;

  const handleConfirm = () => {
    if (!cart || cart.length === 0) {
      alert('Seu pedido está vazio!');
      navigate('/');
      return;
    }
    alert('Pedido confirmado! Em breve entraremos em contato.');
    clearCart();
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4 bg-[#f1faee] min-h-screen">
      <h2 className="text-2xl font-bold text-[#e63946] mb-4">Resumo do Pedido</h2>
      {!cart || cart.length === 0 ? (
        <p className="text-gray-600">Nenhum item no pedido.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2 bg-white p-2 rounded-lg">
              <div>
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-gray-600 text-xs">R$ {item.price.toFixed(2)} x {item.quantity}</p>
              </div>
              <p className="font-semibold text-sm">
                R$ {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <p className="text-base font-bold mt-3">Total: R$ {total}</p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-[#e63946] mb-2">Dados do Cliente</h3>
            <p>Cliente: [Nome do cliente]</p>
            <p>Telefone: [Telefone]</p>
            <p>Endereço: [Endereço]</p>
            <p>Status: Em preparo</p>
          </div>
          <button
            onClick={handleConfirm}
            className="mt-4 w-full bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition"
          >
            Confirmar Pedido
          </button>
          <Link
            to="/"
            className="mt-2 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition block text-center"
          >
            Voltar para Home
          </Link>
        </>
      )}
    </div>
  );
};

export default OrderSummary;
