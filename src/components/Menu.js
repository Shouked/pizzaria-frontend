import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const ProductItem = React.memo(({ product, addToCart }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
    <img
      src={product.image || '/default-pizza.png'}
      alt={product.name}
      className="w-32 h-32 object-cover mb-2 rounded-full"
    />
    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
    <p className="text-gray-600">R$ {product.price.toFixed(2)}</p>
    <button
      onClick={() => addToCart(product)}
      className="mt-2 bg-[#e63946] text-white py-1 px-4 rounded-full hover:bg-red-700 transition"
    >
      Adicionar ao Carrinho
    </button>
  </div>
));

ProductItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};

const Menu = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Tenta carregar do cache primeiro
        const cachedProducts = localStorage.getItem('products');
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts));
          setLoading(false);
          return;
        }

        // Se não houver cache, faz a requisição
        const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/products');
        setProducts(response.data);
        localStorage.setItem('products', JSON.stringify(response.data));
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-600 text-lg">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-[#e63946] mb-6 text-center">Cardápio</h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">Nenhum produto disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductItem key={product._id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
};

Menu.propTypes = {
  cart: PropTypes.array.isRequired,
  setCart: PropTypes.func.isRequired,
};

export default Menu;