import React, { useEffect, useState } from 'react';
import API_BASE from './api';

interface OrderItem { menuItem: { name: string }; quantity: number; }
interface Order { id: string; orderNumber: string; tableNumber: string; status: string; totalAmount: number; paymentStatus: string; paymentMethod?: string; orderedAt: string; branch: { name: string }; orderItems: OrderItem[]; }

const PaymentHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branches, setBranches] = useState<{id:string;name:string}[]>([]);
  const token = localStorage.getItem('token');
  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchBranches();
    fetchPaidOrders();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/branches`, { headers: authHeaders });
      const data = await res.json();
      setBranches(Array.isArray(data) ? data : []);
    } catch {}
  };

  const fetchPaidOrders = async () => {
    try {
      const url = selectedBranch ? `${API_BASE}/api/orders?branchId=${selectedBranch}` : `${API_BASE}/api/orders`;
      const res = await fetch(url, { headers: authHeaders });
      const data = await res.json();
      const paid = (Array.isArray(data) ? data : []).filter((o: Order) => o.paymentStatus === 'PAID');
      setOrders(paid);
    } catch {}
  };

  useEffect(() => { fetchPaidOrders(); }, [selectedBranch]);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Payment History</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #2a4060', background: '#1a2d40', color: '#f5f3ef', fontSize: 14 }}>
            <option value="">All Branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <button className="btn" style={{ padding: '6px 14px', fontSize: 13 }} onClick={fetchPaidOrders}>Refresh</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="stat-card"><h3>{orders.length}</h3><p>Total Transactions</p></div>
        <div className="stat-card"><h3>£{totalRevenue.toFixed(2)}</h3><p>Total Revenue</p></div>
        <div className="stat-card"><h3>£{orders.length ? (totalRevenue / orders.length).toFixed(2) : '0.00'}</h3><p>Average Order Value</p></div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 16 }}>Completed Payments</h2>
        {orders.length === 0 ? (
          <p style={{ color: '#8a9db5', textAlign: 'center', padding: 30 }}>No paid orders found.</p>
        ) : (
          <table>
            <thead><tr><th>Order #</th><th>Branch</th><th>Table</th><th>Items</th><th>Amount</th><th>Method</th><th>Time</th></tr></thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{order.orderNumber}</td>
                  <td>{order.branch?.name}</td>
                  <td>{order.tableNumber || '—'}</td>
                  <td style={{ fontSize: 12 }}>{order.orderItems.map(i => `${i.menuItem.name} x${i.quantity}`).join(', ')}</td>
                  <td style={{ color: '#c9a84c', fontWeight: 700 }}>£{Number(order.totalAmount).toFixed(2)}</td>
                  <td><span className="badge badge-success">{order.paymentMethod || '—'}</span></td>
                  <td style={{ fontSize: 12, color: '#8a9db5' }}>{new Date(order.orderedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
