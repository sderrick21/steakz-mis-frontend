import React, { useEffect, useState } from 'react';
import API_BASE from './api';

interface OrderItem { menuItem: { name: string }; quantity: number; }
interface Order { id: string; orderNumber: string; tableNumber: string; status: string; totalAmount: number; paymentStatus: string; orderedAt: string; branch: { name: string }; waiterCashier: { username: string }; orderItems: OrderItem[]; }

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = localStorage.getItem('token');
  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, { headers: authHeaders });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {}
  };

  useEffect(() => { fetchOrders(); const interval = setInterval(fetchOrders, 5000); return () => clearInterval(interval); }, []);

  const statusColour = (s: string) => {
    if (s === 'PENDING') return '#d97706';
    if (s === 'CONFIRMED') return '#2563eb';
    if (s === 'PREPARING') return '#7c3aed';
    if (s === 'READY') return '#16a34a';
    if (s === 'SERVED') return '#6b7280';
    if (s === 'CANCELLED') return '#dc2626';
    return '#6b7280';
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Order Management</h1>
        <button className="btn" style={{ padding: '6px 14px', fontSize: 13 }} onClick={fetchOrders}>Refresh</button>
      </div>
      <div className="card">
        {orders.length === 0 ? (
          <p style={{ color: '#8a9db5', textAlign: 'center', padding: 30 }}>No orders found.</p>
        ) : (
          <table>
            <thead><tr><th>Order #</th><th>Branch</th><th>Table</th><th>Waiter</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th><th>Time</th></tr></thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{order.orderNumber}</td>
                  <td>{order.branch?.name}</td>
                  <td>{order.tableNumber || '—'}</td>
                  <td>{order.waiterCashier?.username}</td>
                  <td style={{ fontSize: 12 }}>{order.orderItems.map(i => `${i.menuItem.name} x${i.quantity}`).join(', ')}</td>
                  <td style={{ color: '#c9a84c', fontWeight: 700 }}>£{Number(order.totalAmount).toFixed(2)}</td>
                  <td><span className="badge" style={{ background: statusColour(order.status) + '33', color: statusColour(order.status) }}>{order.status}</span></td>
                  <td><span className={`badge ${order.paymentStatus === 'PAID' ? 'badge-success' : 'badge-warning'}`}>{order.paymentStatus}</span></td>
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

export default OrderManagement;
