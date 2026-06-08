// Cashier Payment Processing Page
import React, { useEffect, useState } from 'react';

const PAYMENTS_KEY = 'sharedPayments';
const ORDERS_KEY = 'sharedOrders';

const CashierPayment: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'Cash' | 'Card'>('Cash');
  const [branch, setBranch] = useState<string>('');
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    // Always use these branches
    const branchList = ['downtown', 'uptown', 'suburb'];
    setBranches(branchList);
    if (!branch) setBranch(branchList[0]);
  }, []);

  useEffect(() => {
    // Fetch unpaid orders for the selected branch
    const ordersRaw = localStorage.getItem(ORDERS_KEY);
    let allOrders = ordersRaw ? JSON.parse(ordersRaw) : [];
    const filtered = allOrders.filter((o: any) => o.branch === branch && !o.paid);
    setOrders(filtered);
  }, [branch]);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !amount) return;
    // Save payment
    const paymentsRaw = localStorage.getItem(PAYMENTS_KEY);
    let payments = paymentsRaw ? JSON.parse(paymentsRaw) : [];
    const payment = {
      id: Date.now(),
      orderId: selectedOrderId,
      amount: Number(amount),
      method,
      branch,
      timestamp: Date.now(),
    };
    payments.push(payment);
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    // Mark order as paid
    const ordersRaw = localStorage.getItem(ORDERS_KEY);
    let allOrders = ordersRaw ? JSON.parse(ordersRaw) : [];
    allOrders = allOrders.map((o: any) => o.id === selectedOrderId ? { ...o, paid: true } : o);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    setOrders(allOrders.filter((o: any) => o.branch === branch && !o.paid));
    setSelectedOrderId('');
    setAmount('');
    setMethod('Cash');
    alert('Payment processed!');
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Cashier Payment Processing</h1>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Branch:</label>
        <select className="border p-2 rounded" value={branch} onChange={e => setBranch(e.target.value)}>
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <form onSubmit={handleProcessPayment} className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block mb-1 font-semibold">Select Order:</label>
          <select className="border p-2 rounded w-full" value={selectedOrderId} onChange={e => setSelectedOrderId(e.target.value)}>
            <option value="">-- Select an unpaid order --</option>
            {orders.map((o: any) => (
              <option key={o.id} value={o.id}>Order #{o.id} - ${o.total}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Amount:</label>
          <input className="border p-2 rounded w-full" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Payment Method:</label>
          <select className="border p-2 rounded w-full" value={method} onChange={e => setMethod(e.target.value as 'Cash' | 'Card')}>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Process Payment</button>
      </form>
      <h2 className="text-xl font-bold mb-2">Unpaid Orders</h2>
      <ul className="list-disc pl-6">
        {orders.length === 0 && <li>No unpaid orders for this branch.</li>}
        {orders.map((o: any) => (
          <li key={o.id}>Order #{o.id} - ${o.total} (Customer: {o.customerName || 'N/A'})</li>
        ))}
      </ul>
    </div>
  );
};

export default CashierPayment;