import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Você precisa estar logado para ver os pedidos.");
          return;
        }
        const response = await axios.get(
          "https://pizzaria-backend-e254.onrender.com/api/orders/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data);
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
        if (err.response && err.response.status === 404) {
          setOrders([]); // Nenhum pedido encontrado
        } else {
          setError("Erro ao carregar pedidos. Tente novamente mais tarde.");
        }
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Meus Pedidos</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!error && orders.length === 0 ? (
        <p className="text-gray-600">Nenhum pedido encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-bold">Pedido #{order._id}</p>
              <p>Total: R$ {order.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
