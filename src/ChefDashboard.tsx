import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const ChefDashboard: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'CHEF') { history.replace('/'); return; }
    history.replace('/chef-orders');
  }, [history]);

  return <div className="container"><p style={{ color: '#8a9db5' }}>Redirecting...</p></div>;
};

export default ChefDashboard;
