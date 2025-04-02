import React, { useEffect, useState } from 'react'; import { useTheme } from '../context/ThemeContext'; import api from '../services/api'; import { toast } from 'react-toastify';

const Dashboard = ({ user }) => { const { primaryColor, setPrimaryColor } = useTheme(); const [tenant, setTenant] = useState(null); const [editMode, setEditMode] = useState(false); const [form, setForm] = useState({}); const [logo, setLogo] = useState(null); const [products, setProducts] = useState([]); const [manualOrder, setManualOrder] = useState({ items: [], total: 0 });

const fetchMyTenant = async () => { try { const token = localStorage.getItem('token'); const res = await api.get('/tenants/me', { headers: { Authorization: Bearer ${token} }, }); setTenant(res.data); setForm({ name: res.data.name || '', phone: res.data.phone || '', address: { cep: res.data.address?.cep || '', street: res.data.address?.street || '', number: res.data.address?.number || '' } }); setPrimaryColor(res.data.primaryColor || '#ff0000'); } catch (err) { console.error('Erro ao carregar pizzaria:', err); toast.error('Erro ao carregar informações da pizzaria.'); } };

const fetchProducts = async () => { try { const res = await api.get('/products'); setProducts(res.data); } catch (err) { console.error('Erro ao carregar produtos:', err); } };

useEffect(() => { if (user?.isAdmin && !user?.isSuperAdmin) { fetchMyTenant(); fetchProducts(); } }, [user]);

const handleChange = (e) => { const { name, value } = e.target; if (["cep", "street", "number"].includes(name)) { setForm((prev) => ({ ...prev, address: { ...prev.address, [name]: value }, })); } else { setForm((prev) => ({ ...prev, [name]: value })); } };

const handleColorChange = (e) => { const newColor = e.target.value; setPrimaryColor(newColor); setForm((prev) => ({ ...prev, primaryColor: newColor })); };

const handleSave = async () => { try { const token = localStorage.getItem('token'); await api.put(/tenants/${tenant.tenantId}/me, form, { headers: { Authorization: Bearer ${token} }, }); toast.success('Informações atualizadas com sucesso!'); setEditMode(false); fetchMyTenant(); } catch (err) { console.error(err); toast.error('Erro ao salvar alterações.'); } };

const handleProductChange = (id, field, value) => { setProducts((prev) => prev.map((prod) => prod._id === id ? { ...prod, [field]: value } : prod ) ); };

const handleProductUpdate = async (product) => { try { await api.put(/products/${product._id}, product); toast.success('Produto atualizado!'); } catch (err) { console.error(err); toast.error('Erro ao atualizar produto.'); } };

return ( <div className="p-4 max-w-5xl mx-auto"> <h1 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}> Painel do Administrador </h1>

{!tenant ? (
    <p className="text-gray-500">Carregando dados da pizzaria...</p>
  ) : (
    <div className="space-y-6">
      <section className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Informações da Pizzaria</h2>
        {editMode ? (
          <>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border p-2 mb-2 rounded" placeholder="Nome da pizzaria" />
            <input name="phone" value={form.phone} onChange={handleChange} className="w-full border p-2 mb-2 rounded" placeholder="Telefone" />
            <input name="cep" value={form.address.cep} onChange={handleChange} className="w-full border p-2 mb-2 rounded" placeholder="CEP" />
            <input name="street" value={form.address.street} onChange={handleChange} className="w-full border p-2 mb-2 rounded" placeholder="Rua" />
            <input name="number" value={form.address.number} onChange={handleChange} className="w-full border p-2 mb-2 rounded" placeholder="Número" />
            <label className="block mb-1">Cor Primária:</label>
            <input type="color" value={form.primaryColor || primaryColor} onChange={handleColorChange} className="mb-2" />
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Salvar</button>
              <button onClick={() => setEditMode(false)} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <p><strong>Nome:</strong> {tenant.name}</p>
            <p><strong>Telefone:</strong> {tenant.phone}</p>
            <p><strong>Endereço:</strong> {tenant.address?.street}, {tenant.address?.number} - CEP {tenant.address?.cep}</p>
            <p><strong>Cor do app:</strong> <span style={{ color: tenant.primaryColor }}>{tenant.primaryColor}</span></p>
            <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Editar</button>
          </>
        )}
      </section>

      <section className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Gerenciar Cardápio</h2>
        {products.map((prod) => (
          <div key={prod._id} className="border-b py-2">
            <input className="border p-1 mr-2" value={prod.name} onChange={(e) => handleProductChange(prod._id, 'name', e.target.value)} />
            <input className="border p-1 mr-2 w-24" type="number" value={prod.price} onChange={(e) => handleProductChange(prod._id, 'price', e.target.value)} />
            <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleProductUpdate(prod)}>Salvar</button>
          </div>
        ))}
      </section>

      <section className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Inserir Pedido Manual</h2>
        <p className="text-gray-500">(Funcionalidade futura)</p>
      </section>
    </div>
  )}
</div>

); };

export default Dashboard;

