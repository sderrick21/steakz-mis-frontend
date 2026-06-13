import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import API_BASE from './api';

interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  orderedAt: string;
  orderItems: { menuItem: { name: string }; quantity: number }[];
  waiterCashier: { username: string };
  branch: { name: string };
}

interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
}

interface SalesSummary {
  branchId: string;
  totalRevenue: string;
  totalOrders: number;
  avgOrderValue: string;
  recentOrders: Order[];
}

const ManagerDashboard: React.FC = () => {
  const history = useHistory();
  const [sales, setSales] = useState<SalesSummary | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory'>('overview');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'MANAGER') { history.replace('/'); return; }
    fetchAll();
  }, [history]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [salesRes, invRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE}/api/sales`, { headers }),
        fetch(`${API_BASE}/api/inventory`, { headers }),
        fetch(`${API_BASE}/api/orders`, { headers }),
      ]);
      if (salesRes.ok) setSales(await salesRes.json());
      if (invRes.ok) { const d = await invRes.json(); setInventory(d.inventory || []); }
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const badgeColor = (status: string) => {
    if (status === 'PAID') return '#68d391';
    if (status === 'PENDING') return '#f6ad55';
    if (status === 'CANCELLED') return '#fc8181';
    return '#63b3ed';
  };

  if (loading) return <div className="container"><p style={{color:'#8a9db5',marginTop:'2rem'}}>Loading branch data...</p></div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1 style={{color:'#c9a84c'}}>Manager Dashboard</h1>
        <button className="btn" onClick={fetchAll} style={{padding:'8px 16px',fontSize:'13px'}}>Refresh</button>
      </div>

      {/* KPI Cards */}
      {sales && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'2rem'}}>
          <div className="stat-card">
            <h3>£{parseFloat(sales.totalRevenue).toLocaleString()}</h3>
            <p>Total Revenue (Paid Orders)</p>
          </div>
          <div className="stat-card">
            <h3>{sales.totalOrders}</h3>
            <p>Completed Orders</p>
          </div>
          <div className="stat-card">
            <h3>£{parseFloat(sales.avgOrderValue).toFixed(2)}</h3>
            <p>Average Order Value</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{display:'flex',gap:'8px',marginBottom:'1.5rem'}}>
        {(['overview','orders','inventory'] as const).map(tab => (
          <button key={tab} onClick={()=>setActiveTab(tab)} style={{
            padding:'8px 20px',borderRadius:'6px',border:'none',cursor:'pointer',
            background: activeTab===tab ? '#c9a84c' : '#1a2d40',
            color: activeTab===tab ? '#0f1923' : '#8a9db5',
            fontWeight: activeTab===tab ? '700' : '400',
            textTransform:'capitalize',fontSize:'14px'
          }}>{tab}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="card">
          <h2 style={{marginBottom:'1rem'}}>Recent Paid Orders</h2>
          {(!sales?.recentOrders?.length) ? <p style={{color:'#8a9db5'}}>No paid orders yet.</p> : (
            <table>
              <thead><tr><th>Order #</th><th>Table</th><th>Items</th><th>Total</th><th>Payment</th><th>Time</th></tr></thead>
              <tbody>
                {sales.recentOrders.map(o => (
                  <tr key={o.id}>
                    <td style={{fontSize:'12px'}}>{o.orderNumber}</td>
                    <td>{o.tableNumber || '—'}</td>
                    <td style={{fontSize:'12px'}}>{o.orderItems.map(i=>`${i.menuItem.name} x${i.quantity}`).join(', ')}</td>
                    <td><strong>£{Number(o.totalAmount).toFixed(2)}</strong></td>
                    <td><span style={{background:'#1a3a2a',color:'#68d391',padding:'2px 8px',borderRadius:'12px',fontSize:'11px',fontWeight:'700'}}>PAID</span></td>
                    <td style={{fontSize:'12px'}}>{new Date(o.orderedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="card">
          <h2 style={{marginBottom:'1rem'}}>All Branch Orders</h2>
          {!orders.length ? <p style={{color:'#8a9db5'}}>No orders found.</p> : (
            <table>
              <thead><tr><th>Order #</th><th>Table</th><th>Waiter</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{fontSize:'12px'}}>{o.orderNumber}</td>
                    <td>{o.tableNumber || '—'}</td>
                    <td>{o.waiterCashier?.username}</td>
                    <td style={{fontSize:'12px'}}>{o.orderItems.map(i=>`${i.menuItem.name} x${i.quantity}`).join(', ')}</td>
                    <td><strong>£{Number(o.totalAmount).toFixed(2)}</strong></td>
                    <td><span style={{background:'#162030',color:badgeColor(o.status),padding:'2px 8px',borderRadius:'12px',fontSize:'11px',fontWeight:'700'}}>{o.status}</span></td>
                    <td><span style={{background:'#162030',color:badgeColor(o.paymentStatus),padding:'2px 8px',borderRadius:'12px',fontSize:'11px',fontWeight:'700'}}>{o.paymentStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="card">
          <h2 style={{marginBottom:'1rem'}}>Branch Inventory</h2>
          {!inventory.length ? <p style={{color:'#8a9db5'}}>No inventory items found. Add items via Admin.</p> : (
            <table>
              <thead><tr><th>Item</th><th>Current Stock</th><th>Min Stock</th><th>Unit</th><th>Status</th></tr></thead>
              <tbody>
                {inventory.map(item => {
                  const low = Number(item.currentStock) <= Number(item.minimumStock);
                  return (
                    <tr key={item.id} style={{background: low ? 'rgba(252,129,129,0.05)' : undefined}}>
                      <td><strong>{item.name}</strong></td>
                      <td style={{color: low ? '#fc8181' : '#68d391', fontWeight:'700'}}>{item.currentStock}</td>
                      <td>{item.minimumStock}</td>
                      <td>{item.unit}</td>
                      <td><span style={{background: low?'#3a1a1a':'#1a3a2a',color:low?'#fc8181':'#68d391',padding:'2px 8px',borderRadius:'12px',fontSize:'11px',fontWeight:'700'}}>{low ? '⚠ LOW STOCK' : '✓ OK'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
