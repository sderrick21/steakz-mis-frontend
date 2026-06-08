import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface Order {
  id: string;
  table: string;
  items: { name: string; quantity: number; price: number }[];
  status: string;
  total: number;
}

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  timestamp: string;
}

const ORDERS_KEY = 'sharedOrders';
const PAYMENTS_KEY = 'sharedPayments';

const CashierDashboard: React.FC = () => {
  const history = useHistory();
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Fetch data from localStorage
  const fetchData = () => {
    const ordersRaw = localStorage.getItem(ORDERS_KEY);
    const paymentsRaw = localStorage.getItem(PAYMENTS_KEY);
    setOrders(ordersRaw ? JSON.parse(ordersRaw) : []);
    setPayments(paymentsRaw ? JSON.parse(paymentsRaw) : []);
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'CASHIER' && role !== 'cashier' && role !== 'WAITER_CASHIER' && role !== 'waiter_cashier') {
      history.replace('/');
    }
    fetchData();
    // Listen for localStorage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === ORDERS_KEY || e.key === PAYMENTS_KEY) {
        fetchData();
      }
    };
    window.addEventListener('storage', handleStorage);
    // Polling fallback for same-tab updates
    const interval = setInterval(fetchData, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [history]);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Cashier Dashboard</h1>
      <p className="mb-6">Welcome, Cashier! Use the navigation bar to manage orders, process payments, and view payment history.</p>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Current Orders</h2>
        {orders.length === 0 ? (
          <div className="text-gray-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="px-3 py-2 border-b">Order ID</th>
                  <th className="px-3 py-2 border-b">Table</th>
                  <th className="px-3 py-2 border-b">Items</th>
                  <th className="px-3 py-2 border-b">Status</th>
                  <th className="px-3 py-2 border-b">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b">{order.id}</td>
                    <td className="px-3 py-2 border-b">{order.table}</td>
                    <td className="px-3 py-2 border-b">
                      <ul className="list-disc ml-4">
                        {order.items.map((item, idx) => (
                          <li key={idx}>{item.name} x{item.quantity}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-3 py-2 border-b">{order.status}</td>
                    <td className="px-3 py-2 border-b">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Payment History</h2>
        {payments.length === 0 ? (
          <div className="text-gray-500">No payments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="px-3 py-2 border-b">Payment ID</th>
                  <th className="px-3 py-2 border-b">Order ID</th>
                  <th className="px-3 py-2 border-b">Amount</th>
                  <th className="px-3 py-2 border-b">Method</th>
                  <th className="px-3 py-2 border-b">Time</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b">{payment.id}</td>
                    <td className="px-3 py-2 border-b">{payment.orderId}</td>
                    <td className="px-3 py-2 border-b">${payment.amount.toFixed(2)}</td>
                    <td className="px-3 py-2 border-b">{payment.method}</td>
                    <td className="px-3 py-2 border-b">{new Date(payment.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashierDashboard;
