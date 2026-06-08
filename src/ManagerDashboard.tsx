import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const ManagerDashboard: React.FC = () => {
  const history = useHistory();
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'MANAGER' && role !== 'manager') {
      history.replace('/');
    }
  }, [history]);
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>
      <p>Welcome, Manager! Use the navigation bar to access staff management, menu overview, inventory, reservations, and sales analytics.</p>
    </div>
  );
};

export default ManagerDashboard;
