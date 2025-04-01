import React, { useState } from 'react';
import api from './api'; // Importa o cliente Axios configurado

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Tentando login com:', { email, password });
      // Faz a requisição para /auth/login diretamente, sem tenantId
      const response = await api.post('/auth/login', { email, password });
      console.log('Resposta do login:', response.data);

      const { token } = response.data;
      localStorage.setItem('token', token);
      // Não definimos o tenantId aqui, pois o super admin não tem tenantId

      // Redirecionar para a página inicial ou dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
