import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderSummary = ({ cart, clearCart, user }) => {
  const navigate = useNavigate();

  // Criar o mapa de produtos, garantindo que os IDs sejam válidos
  const productsMap = cart.reduce((map, item) => {
    if (item._id) { // Verificar se o item tem um _id válido
      map[item.name] = item._id;
    }
    return map;
  }, {});

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0).toFixed(2);
  };

  const handleOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Por favor, faça login para continuar.');
        return;
      }

      if (!user || !user._id) {
        alert('Usuário não autenticado. Por favor, faça login novamente.');
        return;
      }

      // Validar se todos os itens têm IDs válidos
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
      };

      console.log('Dados do pedido:', orderData);

      await axios.post('https://pizzaria-backend-e254.onrender.com/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Pedido realizado com sucesso!');
      clearCart();
      navigate('/');
    } catch (err) {
      console.error('Erro ao criar pedido:', err.message);
      alert('Erro ao criar pedido. Tente novamente.');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-[#f1faee] min-h-screen">
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
          <div className="flex justify-between">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition text-sm"
            >
              Adicionar Mais Produtos
            </button>
            <button
              onClick={handleOrder}
              className="bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
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