import React, { useState, useEffect } from "react";
import axios from "axios";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((response) => {
      setProducts(response.data);
    });
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Menu</h1>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => scrollToSection("pizzas")}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Pizzas
        </button>
        <button
          onClick={() => scrollToSection("bebidas")}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Bebidas
        </button>
        <button
          onClick={() => scrollToSection("sobremesas")}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Sobremesas
        </button>
      </div>
      <section id="todas" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Todas</h2>
        {products.map((product) => (
          <div
            key={product.id}
            className="flex justify-between items-center mb-2"
          >
            <span>
              {product.name} - R${product.price}
            </span>
            <button
              onClick={() => addToCart(product)}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Adicionar
            </button>
          </div>
        ))}
      </section>
      <section id="pizzas" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Pizzas</h2>
        {products
          .filter((p) => p.category === "Pizzas")
          .map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {product.name} - R${product.price}
              </span>
              <button
                onClick={() => addToCart(product)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Adicionar
              </button>
            </div>
          ))}
      </section>
      <section id="bebidas" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Bebidas</h2>
        {products
          .filter((p) => p.category === "Bebidas")
          .map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {product.name} - R${product.price}
              </span>
              <button
                onClick={() => addToCart(product)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Adicionar
              </button>
            </div>
          ))}
      </section>
      <section id="sobremesas" className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Sobremesas</h2>
        {products
          .filter((p) => p.category === "Sobremesas")
          .map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {product.name} - R${product.price}
              </span>
              <button
                onClick={() => addToCart(product)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Adicionar
              </button>
            </div>
          ))}
      </section>
    </div>
  );
};

export default Menu;
