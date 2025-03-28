import React from 'react';

const Admin = ({ user }) => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#e63946]">Painel do Administrador</h1>
      <p className="text-gray-700 mb-6">Bem-vindo, <strong>{user?.name}</strong>! Aqui você poderá gerenciar sua pizzaria.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded p-4 hover:shadow-lg transition cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-800">Gerenciar Cardápio</h3>
          <p className="text-sm text-gray-500">Adicione, edite ou remova pizzas e outros produtos.</p>
        </div>
        <div className="bg-white shadow rounded p-4 hover:shadow-lg transition cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-800">Ver Pedidos</h3>
          <p className="text-sm text-gray-500">Acompanhe todos os pedidos realizados em tempo real.</p>
        </div>
        <div className="bg-white shadow rounded p-4 hover:shadow-lg transition cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-800">Editar Dados da Empresa</h3>
          <p className="text-sm text-gray-500">Atualize endereço, telefone e nome da pizzaria.</p>
        </div>
        <div className="bg-white shadow rounded p-4 hover:shadow-lg transition cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-800">Usuários</h3>
          <p className="text-sm text-gray-500">Gerencie usuários e permissões.</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;