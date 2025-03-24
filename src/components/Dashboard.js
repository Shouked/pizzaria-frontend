
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { primaryColor } = useTheme();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>Dashboard</h1>
      {/* Conteúdo do dashboard */}
    </div>
  );
};

export default Dashboard;
