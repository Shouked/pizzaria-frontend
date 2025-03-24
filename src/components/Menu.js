// src/components/Menu.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Menu = ({ cart, setCart, setIsLoginOpen }) => {
  const { tenantId } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const token = localStorage.getItem('token');

        // Busca todas as categorias
        const categoriesResponse = await axios.get(
          `https://pizzaria-backend-e254.onrender.com/api/categories/${tenantId}/categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories(categoriesResponse.data);
        
        // Define a primeira categoria automaticamente como padrão
        if (categoriesResponse.data.length > 0) {
          setSelectedCategory(categoriesResponse.data[0]._id);
        }

        // Busca todos os produtos (opcional: pode ser só produtos da categoria no início)
        const productsResponse = await axios.get(
          `https://pizzaria-backend-e254.onrender.com/api/products/${tenantId}/products`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Erro ao carregar categorias ou produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tenantId) {
      fetchCategoriesAndProducts();
    }
  }, [tenantId]);

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products;

  if (loading) return <div className="p-4">Carregando menu...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-[#e63946]">Cardápio</h2>

      {/* Lista de Categorias */}
      <div className="flex space-x-2 overflow-x-auto mb-4">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setSelectedCategory(category._id)}
            className={`px-4 py-2 rounded-lg border text-sm whitespace-nowrap ${
              selectedCategory === category._id
                ? 'bg-[#e63946] text-white'
                : 'bg-white text-[#e63946] border-[#e63946]'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Produtos */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">Nenhum produto disponível nesta categoria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-40 w-full object-cover mb-2 rounded"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold text-[#e63946]">R$ {product.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 bg-[#e63946] hover:bg-red-700 text-white py-1 px-2 rounded"
              >
                Adicionar ao carrinho
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
