import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderSummary = ({ cart, clearCart, user, setIsLoginOpen }) => {
  const navigate = useNavigate();
  const [deliveryOption, setDeliveryOption] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0); // Rola para o topo ao carregar a página
  }, []);

  const productsMap = cart.reduce((map, item) => {
    if (item._id) {
      map[item.name] = item._id;
    }
    return map;
  }, {});

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0).toFixed(2);
  };

  const handleOrder = async () => {
    if (!user) {
      if (window.confirm('Você precisa estar logado para concluir o pedido. Deseja fazer login agora?')) {
        setIsLoginOpen(true);
      }
      return;
    }

    if (!deliveryOption) {
      alert('Por favor, selecione uma opção de entrega ou retirada.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Por favor, faça login para continuar.');
        setIsLoginOpen(true);
        return;
      }

      const items = cart.map(item => ({
        product: productsMap[item.name],
        quantity: item.quantity || 1,
      }));

      const invalidItems = items.filter(item => !item.product);
      if (invalidItems.length > 0) {
        alert('Alguns itens no carrinho não têm IDs válidos. Por favor, adicione os produtos novamente.');
        return;
      }

      const orderData = {
        user: user._id,
        items,
        total: calculateTotal(),
        deliveryOption,
        address: deliveryOption === 'delivery' ? user.address : null,
      };

      console.log('Dados do pedido:', orderData);

      await axios.post('https://pizzaria-backend-e254.onrender.com/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Pedido realizado com sucesso!');
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Erro ao criar pedido:', err.message);
      alert('Erro ao criar pedido. Tente novamente.');
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Deseja realmente esvaziar o carrinho?')) {
      clearCart();
      navigate('/');
    }
  };

  const handleDeliveryOptionChange = (e) => {
    if (!user) {
      if (window.confirm('Você precisa estar logado para selecionar uma opção de entrega. Deseja fazer login agora?')) {
        setIsLoginOpen(true);
      }
      return;
    }
    setDeliveryOption(e.target.value);
  };

  return (
    <div className="container mx-auto p-4 bg-[#f1faee] min-h-screen pb-16">
      <h1 className="text-3xl font-bold text-[#e63946] mb-4 text-center">Resumo do Pedido</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="mb-4">
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between items-center p-2 border-b">
                <span>{item.name} (x{item.quantity || 1})</span>
                <span>R$ {(item.price * (item.quantity || 1)).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="text-right mb-4">
            <p className="text-lg font-bold">Total: R$ {calculateTotal()}</p>
          </div>

          {/* Opções de Entrega */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Opção de Entrega</h2>
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="delivery"
                  checked={deliveryOption === 'delivery'}
                  onChange={handleDeliveryOptionChange}
                  className="text-[#e63946] focus:ring-[#e63946]"
                />
                <span>Entrega no Endereço</span>
              </label>
              {user && user.address && (
                <div className="ml-6 text-gray-600">
                  <p>{`${user.address.street}, ${user.address.number}`}</p>
                  <p>{`${user.address.neighborhood}, ${user.address.city} - ${user.address.cep}`}</p>
                  {user.address.complement && <p>Complemento: {user.address.complement}</p>}
                </div>
              )}
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="pickup"
                  checked={deliveryOption === 'pickup'}
                  onChange={handleDeliveryOptionChange}
                  className="text-[#e63946] focus:ring-[#e63946]"
                />
                <span>Retirar Pessoalmente</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition text-sm"
            >
              Adicionar Mais Produtos
            </button>
            <button
              onClick={handleClearCart}
              className="bg-gray-500 text-white py-2 px-4 rounded-full hover:bg-gray-600 transition text-sm"
            >
              Esvaziar Carrinho
            </button>
            <button
              onClick={handleOrder}
              disabled={!deliveryOption && user}
              className={`bg-[#e63946] text-white py-2 px-4 rounded-full transition text-sm ${!deliveryOption && user ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
            >
              Concluir Pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSummary;
