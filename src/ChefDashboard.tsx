import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const ChefDashboard: React.FC = () => {
  const history = useHistory();
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'CHEF' && role !== 'chef') {
      history.replace('/');
    }
  }, [history]);
  return (
    <div className="container">
      <h1>Chef Dashboard</h1>
      <p>Welcome, Chef! Here you can view and manage orders.</p>
    </div>
  );
};

export default ChefDashboard;
