import React, { useEffect, useState } from 'react';
import API_BASE from './api';

interface OrderItem { menuItem: { name: string }; quantity: number; specialInstructions?: string; }
interface Order { id: string; orderNumber: string; tableNumber: string; status: string; totalAmount: number; orderedAt: string; notes?: string; branch: { name: string }; waiterCashier: { username: string }; orderItems: OrderItem[]; }

const ChefOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders?status=PENDING,CONFIRMED,PREPARING`, { headers: authHeaders });
      const data = await res.json();
      const active = (Array.isArray(data) ? data : []).filter((o: Order) => ['PENDING','CONFIRMED','PREPARING'].includes(o.status));
      setOrders(active);
    } catch {}
  };

  useEffect(() => { fetchOrders(); const interval = setInterval(fetchOrders, 5000); return () => clearInterval(interval); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PATCH', headers: authHeaders,
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok) { setMessage(`✅ Order updated to ${status}`); fetchOrders(); }
      else setMessage(`❌ ${data.message}`);
    } catch { setMessage('❌ Error updating order'); }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const statusColour = (s: string) => {
    if (s === 'PENDING') return '#d97706';
    if (s === 'CONFIRMED') return '#2563eb';
    if (s === 'PREPARING') return '#7c3aed';
    if (s === 'READY') return '#16a34a';
    return '#6b7280';
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Kitchen Orders</h1>
        <button className="btn" style={{ padding: '6px 14px', fontSize: 13 }} onClick={fetchOrders}>Refresh</button>
      </div>

      {message && <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`} style={{ marginBottom: 16 }}>{message}</div>}

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: '#8a9db5' }}>No active orders — kitchen is clear! 🍽️</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ borderLeft: `4px solid ${statusColour(order.status)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{order.orderNumber}</span>
                <span className="badge" style={{ background: statusColour(order.status) + '33', color: statusColour(order.status) }}>{order.status}</span>
              </div>
              <div style={{ fontSize: 13, color: '#8a9db5', marginBottom: 12 }}>
                {order.branch?.name} · Table {order.tableNumber || '—'} · Waiter: {order.waiterCashier?.username}
              </div>
              <div style={{ marginBottom: 12 }}>
                {order.orderItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>{item.menuItem.name}</span>
                    <span style={{ fontWeight: 600 }}>x{item.quantity}</span>
                  </div>
                ))}
              </div>
              {order.notes && <div style={{ background: '#1a2d40', borderRadius: 6, padding: '6px 10px', fontSize: 13, marginBottom: 12, color: '#c9a84c' }}>📝 {order.notes}</div>}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {order.status === 'PENDING' && (
                  <button className="btn" style={{ flex: 1, background: '#2563eb' }} onClick={() => updateStatus(order.id, 'CONFIRMED')} disabled={loading}>Accept</button>
                )}
                {order.status === 'CONFIRMED' && (
                  <button className="btn" style={{ flex: 1, background: '#7c3aed' }} onClick={() => updateStatus(order.id, 'PREPARING')} disabled={loading}>Start Cooking</button>
                )}
                {order.status === 'PREPARING' && (
                  <button className="btn" style={{ flex: 1, background: '#16a34a' }} onClick={() => updateStatus(order.id, 'READY')} disabled={loading}>Mark Ready</button>
                )}
                {order.status === 'PENDING' && (
                  <button className="btn" style={{ flex: 1, background: '#dc2626' }} onClick={() => updateStatus(order.id, 'CANCELLED')} disabled={loading}>Reject</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChefOrders;
