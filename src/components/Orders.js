import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = ({ user, setIsLoginOpen }) => {
  const [orders, setOrders] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      if (window.confirm('Você precisa estar logado para ver seus pedidos. Deseja fazer login agora?')) {
        setIsLoginOpen(true);
      } else {
        navigate('/');
      }
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/orders/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ordena os pedidos por data decrescente (mais recente primeiro)
        const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
        alert('Erro ao carregar pedidos. Tente novamente.');
      }
    };

    fetchOrders();
  }, [user, setIsLoginOpen, navigate]);

  if (!user) {
    return null; // Redireciona antes de renderizar
  }

  // Pega o pedido mais recente
  const currentOrder = orders.length > 0 ? orders[0] : null;
  // Pega os pedidos antigos (exceto o mais recente)
  const pastOrders = orders.slice(1);

  return (
    <div className="container mx-auto p-4 bg-[#f1faee] min-h-screen pb-16">
      <h1 className="text-3xl font-bold text-[#e63946] mb-6 text-center">Meus Pedidos</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">Você ainda não fez nenhum pedido.</p>
      ) : (
        <>
          {/* Pedido Atual */}
          {currentOrder && (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Pedido #{currentOrder._id}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Realizado em: {new Date(currentOrder.createdAt).toLocaleString('pt-BR')}
              </p>

              {/* Itens do Pedido */}
              <div className="mb-4">
                <h3 className="text-md font-medium text-gray-700 mb-2">Itens:</h3>
                <ul className="space-y-2">
                  {currentOrder.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-semibold">{item.product.name} (x{item.quantity})</p>
                        <p className="text-gray-600 text-sm">
                          R$ {item.product.price.toFixed(2)} cada
                        </p>
                      </div>
                      <p className="font-semibold">
                        R$ {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total */}
              <div className="text-right mb-4">
                <p className="text-lg font-bold text-gray-800">
                  Total: R$ {currentOrder.total.toFixed(2)}
                </p>
              </div>

              {/* Opção de Entrega */}
              <div className="text-gray-600">
                {currentOrder.deliveryOption === 'delivery' ? (
                  <>
                    <p>Entrega no Endereço</p>
                    {currentOrder.address && (
                      <div className="ml-4">
                        <p>{`${currentOrder.address.street}, ${currentOrder.address.number}`}</p>
                        <p>{`${currentOrder.address.neighborhood}, ${currentOrder.address.city} - ${currentOrder.address.cep}`}</p>
                        {currentOrder.address.complement && (
                          <p>Complemento: {currentOrder.address.complement}</p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p>Retirar Pessoalmente</p>
                )}
              </div>
            </div>
          )}

          {/* Botão e Histórico de Pedidos */}
          {pastOrders.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition w-full md:w-auto"
              >
                {showHistory ? 'Ocultar Histórico' : 'Ver Histórico de Pedidos'}
              </button>

              {showHistory && (
                <div className="space-y-6 mt-4">
                  {pastOrders.map((order) => (
                    <div key={order._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        Pedido #{order._id}
                      </h2>
                      <p className="text-gray-600 text-sm mb-4">
                        Realizado em: {new Date(order.createdAt).toLocaleString('pt-BR')}
                      </p>

                      {/* Itens do Pedido */}
                      <div className="mb-4">
                        <h3 className="text-md font-medium text-gray-700 mb-2">Itens:</h3>
                        <ul className="space-y-2">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between items-center border-b pb-2">
                              <div>
                                <p className="font-semibold">{item.product.name} (x{item.quantity})</p>
                                <p className="text-gray-600 text-sm">
                                  R$ {item.product.price.toFixed(2)} cada
                                </p>
                              </div>
                              <p className="font-semibold">
                                R$ {(item.product.price * item.quantity).toFixed(2)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Total */}
                      <div className="text-right mb-4">
                        <p className="text-lg font-bold text-gray-800">
                          Total: R$ {order.total.toFixed(2)}
                        </p>
                      </div>

                      {/* Opção de Entrega */}
                      <div className="text-gray-600">
                        {order.deliveryOption === 'delivery' ? (
                          <>
                            <p>Entrega no Endereço</p>
                            {order.address && (
                              <div className="ml-4">
                                <p>{`${order.address.street}, ${order.address.number}`}</p>
                                <p>{`${order.address.neighborhood}, ${order.address.city} - ${order.address.cep}`}</p>
                                {order.address.complement && (
                                  <p>Complemento: {order.address.complement}</p>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <p>Retirar Pessoalmente</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;