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

const ChefOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

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

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Chef Orders</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Orders to Prepare</h2>
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
                  <th className="px-3 py-2 border-b">Notes</th>
                  <th className="px-3 py-2 border-b">Status</th>
                  <th className="px-3 py-2 border-b">Actions</th>
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
                    <td className="px-3 py-2 border-b">{order.notes || '-'}</td>
                    <td className="px-3 py-2 border-b">{order.status}</td>
                    <td className="px-3 py-2 border-b">
                      {order.status === 'pending' && (
                        <button className="btn btn-blue mr-2" onClick={() => updateOrderStatus(order.id, 'in progress')}>Start</button>
                      )}
                      {order.status === 'in progress' && (
                        <button className="btn btn-green" onClick={() => updateOrderStatus(order.id, 'ready')}>Mark Ready</button>
                      )}
                      {order.status === 'ready' && (
                        <span className="text-green-600 font-semibold">Ready</span>
                      )}
                    </td>
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

export default ChefOrders;
