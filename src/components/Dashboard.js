// src/components/Dashboard.js
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import CreatePizzaria from './admin/CreatePizzaria';

const Dashboard = () => {
  const { primaryColor } = useTheme();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
        Painel do Super Admin
      </h1>

      <CreatePizzaria />
    </div>
  );
};

export default Dashboard;