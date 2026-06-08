import React, { useState } from 'react';

const PaymentProcessing: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState<'cash' | 'card'>('cash');
  const [customer, setCustomer] = useState('');

  // Fetch unpaid orders for this branch
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  React.useEffect(() => {
    // Get branch from currentUser
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const branch = user.branch || '';
    // Get all orders from localStorage
    const allOrders = JSON.parse(localStorage.getItem('sharedOrders') || '[]');
    // Only show unpaid orders for this branch
    const unpaid = allOrders.filter((o: any) => o.status !== 'Paid' && (!branch || o.branch === branch));
    setOrders(unpaid);
    // Real-time sync
    const sync = () => {
      const allOrders = JSON.parse(localStorage.getItem('sharedOrders') || '[]');
      const unpaid = allOrders.filter((o: any) => o.status !== 'Paid' && (!branch || o.branch === branch));
      setOrders(unpaid);
    };
    window.addEventListener('storage', sync);
    const interval = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(interval);
    };
  }, []);

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setCustomer(order.customerName || order.customer || '');
      setAmount(order.total || order.amount || '');
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !customer) {
      setStatus('Please enter amount and customer name.');
      return;
    }
    // Save payment to localStorage (append to sharedPayments)
    const payments = JSON.parse(localStorage.getItem('sharedPayments') || '[]');
    const payment = {
      id: Date.now() + Math.random(),
      customer,
      amount: Number(amount),
      method,
      date: new Date().toISOString(),
      status: 'Paid',
      orderId: selectedOrderId || null,
    };
    payments.push(payment);
    localStorage.setItem('sharedPayments', JSON.stringify(payments));
    // Mark order as paid in sharedOrders
    if (selectedOrderId) {
      const allOrders = JSON.parse(localStorage.getItem('sharedOrders') || '[]');
      const updatedOrders = allOrders.map((o: any) => o.id === selectedOrderId ? { ...o, status: 'Paid' } : o);
      localStorage.setItem('sharedOrders', JSON.stringify(updatedOrders));
    }
    setStatus(`Payment successful! (${method === 'cash' ? 'Cash' : 'Card'})`);
    setAmount('');
    setCustomer('');
    setMethod('cash');
    setSelectedOrderId(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Payment Processing</h1>
      <div className="mb-4">
        <label className="font-semibold">Select Unpaid Order:</label>
        <select
          className="border p-2 rounded w-full mt-1"
          value={selectedOrderId || ''}
          onChange={e => handleOrderSelect(e.target.value)}
        >
          <option value="">-- Select an order --</option>
          {orders.map(order => (
            <option key={order.id} value={order.id}>
              {order.customerName || order.customer || 'Customer'} - ${order.total || order.amount || '?'} (Order #{order.id})
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={handlePayment} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Customer Name or ID"
          value={customer}
          onChange={e => setCustomer(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="method"
              value="cash"
              checked={method === 'cash'}
              onChange={() => setMethod('cash')}
            />
            Cash
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="method"
              value="card"
              checked={method === 'card'}
              onChange={() => setMethod('card')}
            />
            Card
          </label>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit" disabled={!selectedOrderId && (!amount || !customer)}>Process Payment</button>
      </form>
      {status && <div className="mt-4 text-green-700 font-semibold">{status}</div>}
    </div>
  );
};

export default PaymentProcessing;
