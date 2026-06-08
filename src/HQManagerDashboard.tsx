import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const HQManagerDashboard: React.FC = () => {
  const history = useHistory();
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'HQMANAGER' && role !== 'hqmanager' && role !== 'HQ_MANAGER') {
      history.replace('/');
    }
  }, [history]);

  return (
    <div className="container">
      <h1>HQ Manager Dashboard</h1>
      <p>Welcome, HQ Manager! Here you can oversee all branches and reports.</p>
    </div>
  );
};

export default HQManagerDashboard;
