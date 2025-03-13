import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OrderSummary = ({ cart, clearCart, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [productsMap, setProductsMap] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/products');
        const map = {};
        response.data.forEach(product => {
          map[product.name] = product._id; // Mapeia nome para _id
        });
        setProductsMap(map);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleOrderSubmit = async () => {
    if (!user) {
      setError('Você precisa estar logado para concluir o pedido.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://pizzaria-backend-e254.onrender.com/api/orders',
        {
          items: cart.map(item => ({
            product: productsMap[item.name], // Usa o _id do produto
            quantity: item.quantity || 1,
          })),
          total: cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
          user: {
            name: user?.name || 'Usuário não identificado',
            phone: user?.phone || 'Não informado',
            address: user?.address
              ? `${user.address.street}, ${user.address.number}, ${user.address.neighborhood}, ${user.address.city}, CEP: ${user.address.cep}${user.address.complement ? `, ${user.address.complement}` : ''}`
              : 'Endereço não informado',
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Pedido criado:', response.data);
      clearCart();
      alert('Pedido realizado com sucesso!');
    } catch (err) {
      console.error('Erro ao criar pedido:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erro ao criar pedido. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-4 bg-[#f1faee] min-h-screen">
        <h2 className="text-2xl font-bold text-[#e63946] mb-4">Resumo do Pedido</h2>
        <p className="text-gray-600">Nenhum item no carrinho.</p>
        <Link
          to="/"
          className="mt-2 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition block text-center text-sm"
        >
          Voltar para o Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-[#f1faee] min-h-screen">
      <h2 className="text-2xl font-bold text-[#e63946] mb-4">Resumo do Pedido</h2>
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Itens</h3>
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
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Informações do Cliente</h3>
        {user ? (
          <>
            <p><strong>Nome:</strong> {user.name || 'Não informado'}</p>
            <p><strong>Telefone:</strong> {user.phone || 'Não informado'}</p>
            <p>
              <strong>Endereço:</strong>{' '}
              {user.address
                ? `${user.address.street}, ${user.address.number}, ${user.address.neighborhood}, ${user.address.city}, CEP: ${user.address.cep}${user.address.complement ? `, ${user.address.complement}` : ''}`
                : 'Endereço não informado'}
            </p>
          </>
        ) : (
          <p className="text-red-500">Você precisa estar logado para ver as informações do cliente.</p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={handleOrderSubmit}
        disabled={isLoading}
        className={`w-full bg-[#e63946] text-white py-2 px-4 rounded-full transition text-sm ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
        }`}
      >
        {isLoading ? 'Enviando...' : 'Confirmar Pedido'}
      </button>
      <Link
        to="/"
        className="mt-2 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition block text-center text-sm"
      >
        Voltar para o Menu
      </Link>
    </div>
  );
};

export default OrderSummary;
