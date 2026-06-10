import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const CashierDashboard: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'CASHIER') { history.replace('/'); return; }
    history.replace('/cashier-payment');
  }, [history]);

  return <div className="container"><p style={{ color: '#8a9db5' }}>Redirecting...</p></div>;
};

export default CashierDashboard;
