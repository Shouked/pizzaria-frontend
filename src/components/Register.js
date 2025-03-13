import React, { useState } from 'react';

const Register = ({ setIsRegisterOpen, setIsLoggedIn }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Usuário registrado:', form);
    setIsLoggedIn(true);
    setIsRegisterOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#e63946] mb-4">Cadastre-se</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Endereço</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Cidade</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Estado</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">CEP</label>
            <input
              type="text"
              name="zip"
              value={form.zip}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition"
          >
            Cadastrar
          </button>
          <button
            onClick={() => setIsRegisterOpen(false)}
            className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition mt-2"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
