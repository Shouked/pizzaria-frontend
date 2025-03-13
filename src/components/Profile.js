import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ user, setUser, setIsLoggedIn }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      cep: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      complement: '',
    },
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://pizzaria-backend-e254.onrender.com/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setFormData({
          name: response.data.name,
          phone: response.data.phone,
          address: {
            cep: response.data.address.cep,
            street: response.data.address.street,
            number: response.data.address.number,
            neighborhood: response.data.address.neighborhood,
            city: response.data.address.city,
            complement: response.data.address.complement || '',
          },
        });
      } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
      }
    };
    fetchUser();
  }, [setUser, setIsLoggedIn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData({
        ...formData,
        address: { ...formData.address, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'https://pizzaria-backend-e254.onrender.com/api/auth/me',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
      setIsEditing(false);
      setShowConfirmation(false);
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
    }
  };

  const cancelChanges = () => {
    setFormData({
      name: user.name,
      phone: user.phone,
      address: {
        cep: user.address.cep,
        street: user.address.street,
        number: user.address.number,
        neighborhood: user.address.neighborhood,
        city: user.address.city,
        complement: user.address.complement || '',
      },
    });
    setIsEditing(false);
    setShowConfirmation(false);
  };

  return (
    <div className="container mx-auto p-4 bg-[#f1faee] min-h-screen">
      <h2 className="text-2xl font-bold text-[#e63946] mb-4">Perfil</h2>
      {!user ? (
        <p className="text-gray-600">Carregando...</p>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">CEP</label>
                <input
                  type="text"
                  name="cep"
                  value={formData.address.cep}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Rua</label>
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Número</label>
                <input
                  type="text"
                  name="number"
                  value={formData.address.number}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Bairro</label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.address.neighborhood}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Complemento</label>
                <input
                  type="text"
                  name="complement"
                  value={formData.address.complement}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
              >
                Salvar Alterações
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="mt-2 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition text-sm"
              >
                Cancelar
              </button>
            </form>
          ) : (
            <div>
              <p><strong>Nome:</strong> {user.name}</p>
              <p><strong>Telefone:</strong> {user.phone}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>CEP:</strong> {user.address.cep}</p>
              <p><strong>Rua:</strong> {user.address.street}</p>
              <p><strong>Número:</strong> {user.address.number}</p>
              <p><strong>Bairro:</strong> {user.address.neighborhood}</p>
              <p><strong>Cidade:</strong> {user.address.city}</p>
              {user.address.complement && <p><strong>Complemento:</strong> {user.address.complement}</p>}
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 w-full bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
              >
                Editar
              </button>
              <Link
                to="/"
                className="mt-2 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition block text-center text-sm"
              >
                Voltar para Home
              </Link>
            </div>
          )}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <div className="bg-white p-4 rounded-lg w-11/12 md:w-1/3">
                <p className="text-gray-800 mb-4">Confirma as alterações?</p>
                <button
                  onClick={confirmChanges}
                  className="w-full bg-[#e63946] text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm mb-2"
                >
                  Salvar
                </button>
                <button
                  onClick={cancelChanges}
                  className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
