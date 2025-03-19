import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Para animações
import { toast } from 'react-toastify'; // Para notificações
import jsPDF from 'jspdf'; // Para exportação de PDF

const Orders = ({ user, setIsLoginOpen, setCart }) => {
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
        const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
        alert('Erro ao carregar pedidos. Tente novamente.');
      }
    };

    fetchOrders();

    // Polling para verificar mudanças no status
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/orders/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        updatedOrders.forEach((newOrder, i) => {
          if (newOrder.status !== orders[i]?.status) {
            toast.success(`Pedido #${newOrder._id.slice(-6)} agora está ${newOrder.status}!`);
          }
        });
        setOrders(updatedOrders);
      } catch (err) {
        console.error('Erro no polling de pedidos:', err);
      }
    }, 30000); // Checa a cada 30 segundos

    return () => clearInterval(interval);
  }, [user, setIsLoginOpen, navigate, orders]);

  const handleReorder = (items) => {
    const newCart = items.map(item => ({ ...item.product, quantity: item.quantity }));
    setCart(newCart);
    navigate('/order-summary');
  };

  const exportToPDF = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Pizza da Bia - Pedido #${order._id.slice(-6)}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Realizado em: ${new Date(order.createdAt).toLocaleString('pt-BR')}`, 10, 20);
    doc.text(`Status: ${order.status}`, 10, 30);
    doc.text('Itens:', 10, 40);
    order.items.forEach((item, index) => {
      doc.text(`${item.quantity}x ${item.product.name} - R$ ${(item.product.price * item.quantity).toFixed(2)}`, 10, 50 + index * 10);
    });
    doc.text(`Total: R$ ${order.total.toFixed(2)}`, 10, 50 + order.items.length * 10 + 10);
    doc.text(order.deliveryOption === 'delivery' ? 'Entrega no Endereço' : 'Retirar Pessoalmente', 10, 50 + order.items.length * 10 + 20);
    if (order.deliveryOption === 'delivery' && order.address) {
      doc.text(`${order.address.street}, ${order.address.number}`, 10, 50 + order.items.length * 10 + 30);
      doc.text(`${order.address.neighborhood}, ${order.address.city} - ${order.address.cep}`, 10, 50 + order.items.length * 10 + 40);
      if (order.address.complement) {
        doc.text(`Complemento: ${order.address.complement}`, 10, 50 + order.items.length * 10 + 50);
      }
    }
    doc.save(`pedido_${order._id.slice(-6)}.pdf`);
  };

  if (!user) {
    return null;
  }

  const currentOrder = orders.length > 0 ? orders[0] : null;
  const pastOrders = orders.slice(1);

  return (
    <div className="container mx-auto p-4 bg-[#f1faee] min-h-screen pb-20">
      <h1 className="text-3xl font-bold text-[#e63946] mb-6 text-center">Meus Pedidos</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">Você ainda não fez nenhum pedido.</p>
      ) : (
        <>
          {currentOrder && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-r-4 border-[#e63946] mb-6 max-w-full"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-800 break-words">
                  Pedido #{currentOrder._id}
                </h2>
                <p className={`text-sm font-semibold mt-1 sm:mt-0 ${currentOrder.status === 'Entregue' ? 'text-green-600' : 'text-yellow-600'} max-w-xs break-words`}>
                  {currentOrder.status}
                </p>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Realizado em: {new Date(currentOrder.createdAt).toLocaleString('pt-BR')}
              </p>

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

              <div className="text-right mb-4">
                <p className="text-lg font-bold text-gray-800">
                  Total: R$ {currentOrder.total.toFixed(2)}
                </p>
              </div>

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

              <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4">
                <button
                  onClick={() => handleReorder(currentOrder.items)}
                  className="bg-[#e63946] text-white py-1 px-3 rounded-full hover:bg-red-700 transition mb-2 sm:mb-0"
                >
                  Fazer Novamente
                </button>
                <button
                  onClick={() => exportToPDF(currentOrder)}
                  className="bg-gray-500 text-white py-1 px-3 rounded-full hover:bg-gray-600 transition"
                >
                  Exportar PDF
                </button>
              </div>
            </motion.div>
          )}

          {pastOrders.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition w-full md:w-auto"
              >
                {showHistory ? 'Ocultar Histórico' : 'Ver Histórico de Pedidos'}
              </button>

              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 mt-4"
                >
                  {pastOrders.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-r-4 border-[#e63946] max-w-full"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h2 className="text-xl font-bold text-gray-800 break-words">
                          Pedido #{order._id}
                        </h2>
                        <p className={`text-sm font-semibold mt-1 sm:mt-0 ${order.status === 'Entregue' ? 'text-green-600' : 'text-yellow-600'} max-w-xs break-words`}>
                          {order.status}
                        </p>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        Realizado em: {new Date(order.createdAt).toLocaleString('pt-BR')}
                      </p>

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

                      <div className="text-right mb-4">
                        <p className="text-lg font-bold text-gray-800">
                          Total: R$ {order.total.toFixed(2)}
                        </p>
                      </div>

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

                      <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4">
                        <button
                          onClick={() => handleReorder(order.items)}
                          className="bg-[#e63946] text-white py-1 px-3 rounded-full hover:bg-red-700 transition mb-2 sm:mb-0"
                        >
                          Fazer Novamente
                        </button>
                        <button
                          onClick={() => exportToPDF(order)}
                          className="bg-gray-500 text-white py-1 px-3 rounded-full hover:bg-gray-600 transition"
                        >
                          Exportar PDF
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
