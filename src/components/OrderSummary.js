import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderSummary = ({ user, cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      setIsLoginOpen(true);
      return;
    }

    if (cart.length === 0) {
      alert('Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.');
      return;
    }

    try {
      const orderPayload = {
        tenantId,
        userId: user._id,
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
      };

      const response = await axios.post(
        `https://pizzaria-backend-e254.onrender.com/api/orders/${tenantId}/orders`, // Corrigido para incluir "/orders"
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Pedido criado com sucesso:', response.data);
      alert('Pedido realizado com sucesso!');
      setCart([]);
    } catch (error) {
      console.error('Erro ao enviar pedido:', error.response?.data || error.message);
      alert('Erro ao enviar pedido: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#e63946] mb-4">Resumo do Pedido</h2>

      {cart.length === 0 ? (
        <p className="text-gray-600">Seu carrinho está vazio.</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item._id} className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="font-semibold text-[#1d3557]">{item.name}</h3>
                <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
              </div>
              <span className="text-[#e63946] font-bold">
                R$ {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="text-right mt-4">
            <p className="text-lg font-semibold text-[#1d3557]">
              Total: R$ {cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
            </p>
            <button
              onClick={handlePlaceOrder}
              className="mt-2 bg-[#e63946] text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Finalizar Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
