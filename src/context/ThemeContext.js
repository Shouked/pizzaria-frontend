// src/context/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const { tenantId } = useParams();

  const [theme, setTheme] = useState({
    primaryColor: '#E63946',
    secondaryColor: '#F1FAEE',
    logoUrl: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await api.get(`/tenants/${tenantId}`);
        const tenant = res.data;

        setTheme({
          primaryColor: tenant.primaryColor || '#E63946',
          secondaryColor: tenant.secondaryColor || '#F1FAEE',
          logoUrl: tenant.logoUrl || ''
        });
      } catch (err) {
        console.error('Erro ao carregar o tema:', err);
      } finally {
        setLoading(false);
      }
    };

    if (tenantId) {
      fetchTenant();
    } else {
      setLoading(false);
    }
  }, [tenantId]);

  if (loading) {
    return <div>Carregando tema...</div>;
  }

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
