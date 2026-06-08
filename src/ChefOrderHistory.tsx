import React, { useEffect, useState } from 'react';

interface Order {
  id: string;
  table: string;
  items: { name: string; quantity: number; price: number }[];
  status: string;
  total: number;
  notes?: string;
}

const ORDERS_KEY = 'sharedOrders';

const ChefOrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

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

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Chef Order History</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Completed Orders</h2>
        {orders.filter(o => o.status === 'ready').length === 0 ? (
          <div className="text-gray-500">No completed orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="px-3 py-2 border-b">Order ID</th>
                  <th className="px-3 py-2 border-b">Table</th>
                  <th className="px-3 py-2 border-b">Items</th>
                  <th className="px-3 py-2 border-b">Notes</th>
                  <th className="px-3 py-2 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.filter(order => order.status === 'ready').map((order) => (
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
                    <td className="px-3 py-2 border-b">{order.notes || '-'}</td>
                    <td className="px-3 py-2 border-b text-green-600 font-semibold">{order.status}</td>
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

export default ChefOrderHistory;
