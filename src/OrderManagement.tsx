import React, { useEffect, useState } from 'react';

const ORDERS_KEY = 'sharedOrders';
const PAYMENTS_KEY = 'sharedPayments';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  // Fetch orders from localStorage
  const fetchOrders = () => {
    const ordersRaw = localStorage.getItem(ORDERS_KEY);
    setOrders(ordersRaw ? JSON.parse(ordersRaw) : []);
  };

  useEffect(() => {
    fetchOrders();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === ORDERS_KEY) fetchOrders();
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(fetchOrders, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const handleStatus = (id: string, status: string) => {
    const updatedOrders = orders.map((o) => o.id === id ? { ...o, status } : o);
    setOrders(updatedOrders);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    if (status === 'paid') {
      // Add payment to sharedPayments only if not already present
      const paidOrder = orders.find((o) => o.id === id);
      if (paidOrder) {
        const paymentsRaw = localStorage.getItem(PAYMENTS_KEY);
        const payments = paymentsRaw ? JSON.parse(paymentsRaw) : [];
        const alreadyPaid = payments.some((p: any) => p.orderId === paidOrder.id);
        if (!alreadyPaid) {
          const newPayment = {
            id: Date.now().toString(),
            orderId: paidOrder.id,
            amount: paidOrder.total,
            method: 'Cash', // or prompt/select method if needed
            timestamp: new Date().toISOString(),
          };
          payments.push(newPayment);
          localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      <table className="w-full border text-left mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Order ID</th>
            <th className="p-2">Table</th>
            <th className="p-2">Items</th>
            <th className="p-2">Total</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-t">
              <td className="p-2">{order.id}</td>
              <td className="p-2">{order.table}</td>
              <td className="p-2">{order.items.map((item: any) => `${item.name} x${item.quantity}`).join(', ')}</td>
              <td className="p-2">${order.total}</td>
              <td className="p-2">{order.status}</td>
              <td className="p-2 flex gap-2">
                {order.status === 'pending' && (
                  <button className="bg-green-600 text-white px-2 py-1 rounded text-xs" onClick={() => handleStatus(order.id, 'paid')}>Mark as Paid</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
