import React, { useEffect, useState } from 'react';

const PAYMENTS_KEY = 'sharedPayments';

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  // Branch selector for payment history (admin/manager)
  const [branch, setBranch] = useState<string>('');
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    // Always use these branches
    const branchList = ['downtown', 'uptown', 'suburb'];
    setBranches(branchList);
    if (!branch) setBranch(branchList[0]);
  }, []);

  // Filter payments by branch
  useEffect(() => {
    const fetchPayments = () => {
      const paymentsRaw = localStorage.getItem(PAYMENTS_KEY);
      let allPayments = paymentsRaw ? JSON.parse(paymentsRaw) : [];
      // Only filter if branch is set
      if (branch) {
        allPayments = allPayments.filter((p: any) => p.branch === branch);
      }
      setPayments(allPayments);
    };
    fetchPayments();
    // Real-time sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === PAYMENTS_KEY) fetchPayments();
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(fetchPayments, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [branch, branches]); // Add both 'branch' and 'branches' to dependency array to fix eslint warning

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>
      {/* Branch selector for admin/manager */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Branch:</label>
        <select className="border p-2 rounded" value={branch} onChange={e => setBranch(e.target.value)}>
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Payment ID</th>
            <th className="p-2">Order ID</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Time</th>
            <th className="p-2">Method</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id} className="border-t">
              <td className="p-2">{payment.id}</td>
              <td className="p-2">{payment.orderId}</td>
              <td className="p-2">${payment.amount}</td>
              <td className="p-2">{new Date(payment.timestamp || payment.time).toLocaleString()}</td>
              <td className="p-2">{payment.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
