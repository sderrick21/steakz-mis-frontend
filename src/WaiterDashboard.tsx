import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import API_BASE from './api';

interface Branch { id: string; name: string; }
interface MenuItem { id: string; name: string; price: number; category: { name: string }; }
interface CartItem { menuItemId: string; name: string; price: number; quantity: number; specialInstructions: string; }
interface Order { id: string; orderNumber: string; tableNumber: string; status: string; totalAmount: number; orderedAt: string; branch: { name: string }; orderItems: { menuItem: { name: string }; quantity: number }[]; }

const WaiterDashboard: React.FC = () => {
  const history = useHistory();
  const token = localStorage.getItem('token');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'place' | 'orders'>('place');
  const [loading, setLoading] = useState(false);

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'WAITER') { history.replace('/'); return; }
    fetchBranches();
    fetchMenu();
    fetchMyOrders();
  }, [history]);

  const fetchBranches = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/branches`, { headers: authHeaders });
      const data = await res.json();
      setBranches(data);
      if (data.length > 0) setSelectedBranch(data[0].id);
    } catch {}
  };

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/menu`, { headers: authHeaders });
      const data = await res.json();
      setMenuItems(data);
    } catch {}
  };

  const fetchMyOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, { headers: authHeaders });
      const data = await res.json();
      setMyOrders(Array.isArray(data) ? data : []);
    } catch {}
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.menuItemId === item.id);
      if (existing) return prev.map(c => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1, specialInstructions: '' }];
    });
  };

  const removeFromCart = (menuItemId: string) => setCart(prev => prev.filter(c => c.menuItemId !== menuItemId));

  const updateQty = (menuItemId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(menuItemId); return; }
    setCart(prev => prev.map(c => c.menuItemId === menuItemId ? { ...c, quantity: qty } : c));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const submitOrder = async () => {
    if (!selectedBranch || cart.length === 0 || !tableNumber) {
      setMessage('Please select a branch, table number, and add items to your order.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          branchId: selectedBranch,
          tableNumber,
          orderType: 'DINE_IN',
          notes,
          items: cart.map(c => ({ menuItemId: c.menuItemId, quantity: c.quantity, specialInstructions: c.specialInstructions }))
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Order ${data.order.orderNumber} placed successfully!`);
        setCart([]);
        setTableNumber('');
        setNotes('');
        fetchMyOrders();
        setActiveTab('orders');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch {
      setMessage('❌ Error placing order. Please try again.');
    }
    setLoading(false);
  };

  const statusColour = (s: string) => {
    if (s === 'PENDING') return '#d97706';
    if (s === 'CONFIRMED' || s === 'PREPARING') return '#2563eb';
    if (s === 'READY') return '#16a34a';
    if (s === 'SERVED') return '#6b7280';
    if (s === 'CANCELLED') return '#dc2626';
    return '#6b7280';
  };

  const groupedMenu = menuItems.reduce((acc: any, item) => {
    const cat = item.category?.name || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="container">
      <div className="page-header">
        <h1>Waiter Dashboard</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" style={{ background: activeTab === 'place' ? 'var(--brand, #c9a84c)' : 'transparent', border: '2px solid #c9a84c', color: activeTab === 'place' ? '#0f1923' : '#c9a84c' }} onClick={() => setActiveTab('place')}>Place Order</button>
          <button className="btn" style={{ background: activeTab === 'orders' ? 'var(--brand, #c9a84c)' : 'transparent', border: '2px solid #c9a84c', color: activeTab === 'orders' ? '#0f1923' : '#c9a84c' }} onClick={() => { setActiveTab('orders'); fetchMyOrders(); }}>My Orders</button>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`} style={{ marginBottom: 20 }}>
          {message}
          <button onClick={() => setMessage('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 16 }}>×</button>
        </div>
      )}

      {activeTab === 'place' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Menu */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 1, minWidth: 200 }}>
                  <label>Branch</label>
                  <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}>
                    {branches.filter(b => b.id === selectedBranch).length > 0
                      ? branches.filter(b => b.id === selectedBranch).map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                      : branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                    }
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: 120 }}>
                  <label>Table Number</label>
                  <input type="text" placeholder="e.g. T4" value={tableNumber} onChange={e => setTableNumber(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 2, minWidth: 200 }}>
                  <label>Notes (optional)</label>
                  <input type="text" placeholder="e.g. No onions, allergen info..." value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>
            </div>

            {Object.entries(groupedMenu).map(([category, items]: any) => (
              <div key={category} className="card" style={{ marginBottom: 16 }}>
                <h2 style={{ marginBottom: 12 }}>{category}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {items.map((item: MenuItem) => (
                    <div key={item.id} style={{ background: '#1a2d40', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 4, color: '#f5f3ef' }}>{item.name}</div>
                        <div style={{ color: '#c9a84c', fontWeight: 700, marginBottom: 8 }}>£{Number(item.price).toFixed(2)}</div>
                      </div>
                      <button className="btn" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => addToCart(item)}>+ Add</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Cart */}
          <div>
            <div className="card" style={{ position: 'sticky', top: 20 }}>
              <h2 style={{ marginBottom: 16 }}>Order Summary</h2>
              {cart.length === 0 ? (
                <p style={{ color: '#8a9db5', textAlign: 'center', padding: '20px 0' }}>No items added yet</p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.menuItemId} style={{ borderBottom: '1px solid #1e3048', paddingBottom: 10, marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</span>
                        <button onClick={() => removeFromCart(item.menuItemId)} style={{ background: 'none', border: 'none', color: '#fc8181', cursor: 'pointer', fontSize: 16 }}>×</button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                        <button onClick={() => updateQty(item.menuItemId, item.quantity - 1)} style={{ background: '#2a4060', border: 'none', color: '#fff', borderRadius: 4, width: 24, height: 24, cursor: 'pointer' }}>−</button>
                        <span style={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.menuItemId, item.quantity + 1)} style={{ background: '#2a4060', border: 'none', color: '#fff', borderRadius: 4, width: 24, height: 24, cursor: 'pointer' }}>+</button>
                        <span style={{ marginLeft: 'auto', color: '#c9a84c', fontWeight: 600 }}>£{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ borderTop: '2px solid #c9a84c', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16 }}>
                    <span>Total</span>
                    <span style={{ color: '#c9a84c' }}>£{cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="btn" style={{ width: '100%', marginTop: 16, padding: '12px', fontSize: 15, opacity: loading ? 0.7 : 1 }} onClick={submitOrder} disabled={loading}>
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2>My Orders</h2>
            <button className="btn" style={{ padding: '6px 14px', fontSize: 13 }} onClick={fetchMyOrders}>Refresh</button>
          </div>
          {myOrders.length === 0 ? (
            <p style={{ color: '#8a9db5', textAlign: 'center', padding: 30 }}>No orders placed yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Branch</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{order.orderNumber}</td>
                    <td>{order.branch?.name}</td>
                    <td>{order.tableNumber || '—'}</td>
                    <td>{order.orderItems.map(i => `${i.menuItem.name} x${i.quantity}`).join(', ')}</td>
                    <td style={{ color: '#c9a84c', fontWeight: 600 }}>£{Number(order.totalAmount).toFixed(2)}</td>
                    <td><span className="badge" style={{ background: statusColour(order.status) + '33', color: statusColour(order.status), fontWeight: 700 }}>{order.status}</span></td>
                    <td style={{ fontSize: 12, color: '#8a9db5' }}>{new Date(order.orderedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default WaiterDashboard;
