import React, { useEffect, useState } from 'react';
import API_BASE from './api';

interface OrderItem { menuItem: { name: string }; quantity: number; }
interface Order { id: string; orderNumber: string; tableNumber: string; status: string; totalAmount: number; paymentStatus: string; orderedAt: string; branch: { name: string }; waiterCashier: { username: string }; orderItems: OrderItem[]; }

const PaymentProcessing: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchUnpaidOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, { headers: authHeaders });
      const data = await res.json();
      const unpaid = (Array.isArray(data) ? data : []).filter((o: Order) => o.paymentStatus === 'PENDING' && o.status !== 'CANCELLED');
      setOrders(unpaid);
    } catch {}
  };

  useEffect(() => { fetchUnpaidOrders(); }, []);

  const handlePayment = async () => {
    if (!selectedOrder) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders/${selectedOrder.id}/payment`, {
        method: 'PATCH', headers: authHeaders,
        body: JSON.stringify({ paymentMethod })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Payment of £${Number(selectedOrder.totalAmount).toFixed(2)} processed via ${paymentMethod}`);
        setSelectedOrder(null);
        fetchUnpaidOrders();
      } else setMessage(`❌ ${data.message}`);
    } catch { setMessage('❌ Error processing payment'); }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="page-header"><h1>Payment Processing</h1></div>

      {message && (
        <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`} style={{ marginBottom: 16 }}>
          {message}
          <button onClick={() => setMessage('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 16 }}>×</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Unpaid orders list */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2>Unpaid Orders</h2>
            <button className="btn" style={{ padding: '6px 14px', fontSize: 13 }} onClick={fetchUnpaidOrders}>Refresh</button>
          </div>
          {orders.length === 0 ? (
            <p style={{ color: '#8a9db5', textAlign: 'center', padding: 30 }}>No unpaid orders.</p>
          ) : (
            <table>
              <thead><tr><th>Order #</th><th>Branch</th><th>Table</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ background: selectedOrder?.id === order.id ? '#1a3a5c' : '' }}>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{order.orderNumber}</td>
                    <td>{order.branch?.name}</td>
                    <td>{order.tableNumber || '—'}</td>
                    <td style={{ fontSize: 12 }}>{order.orderItems.map(i => `${i.menuItem.name} x${i.quantity}`).join(', ')}</td>
                    <td style={{ color: '#c9a84c', fontWeight: 700 }}>£{Number(order.totalAmount).toFixed(2)}</td>
                    <td><span className="badge badge-warning">{order.status}</span></td>
                    <td><button className="btn" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => setSelectedOrder(order)}>Select</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Payment panel */}
        <div className="card" style={{ height: 'fit-content', position: 'sticky', top: 20 }}>
          <h2 style={{ marginBottom: 16 }}>Process Payment</h2>
          {!selectedOrder ? (
            <p style={{ color: '#8a9db5', textAlign: 'center', padding: 20 }}>Select an order from the list to process payment.</p>
          ) : (
            <>
              <div style={{ background: '#1a2d40', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{selectedOrder.orderNumber}</div>
                <div style={{ fontSize: 13, color: '#8a9db5', marginBottom: 8 }}>{selectedOrder.branch?.name} · Table {selectedOrder.tableNumber || '—'}</div>
                {selectedOrder.orderItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 2 }}>
                    <span>{item.menuItem.name}</span><span>x{item.quantity}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #2a4060', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16 }}>
                  <span>Total</span>
                  <span style={{ color: '#c9a84c' }}>£{Number(selectedOrder.totalAmount).toFixed(2)}</span>
                </div>
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="DIGITAL_WALLET">Digital Wallet</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn" style={{ flex: 1, opacity: loading ? 0.7 : 1 }} onClick={handlePayment} disabled={loading}>{loading ? 'Processing...' : 'Process Payment'}</button>
                <button className="btn" style={{ background: 'transparent', border: '1px solid #2a4060', color: '#8a9db5' }} onClick={() => setSelectedOrder(null)}>Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
