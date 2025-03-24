import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const Menu = ({ cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/${tenantId}/products`);
        const fetchedProducts = res.data;

        // Agrupar por categoria
        const grouped = fetchedProducts.reduce((acc, product) => {
          const category = product.category || 'Outros';
          if (!acc[category]) acc[category] = [];
          acc[category].push(product);
          return acc;
        }, {});

        setGroupedProducts(grouped);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    };

    if (tenantId) {
      fetchProducts();
    }
  }, [tenantId]);

  const addToCart = (product) => {
    const itemIndex = cart.findIndex((item) => item._id === product._id);
    let updatedCart = [...cart];

    if (itemIndex >= 0) {
      updatedCart[itemIndex].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-center text-[#e63946] mb-4">Cardápio</h2>

      {Object.keys(groupedProducts).length === 0 && (
        <p className="text-center text-gray-500">Nenhum produto disponível no momento.</p>
      )}

      {Object.entries(groupedProducts).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h4 className="text-md font-bold">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-sm font-semibold text-[#e63946]">R$ {product.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 bg-[#e63946] text-white px-4 py-1 rounded hover:bg-red-600 transition text-sm"
                >
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
