import React, { useEffect, useState } from 'react';

const SALES_KEY = 'sharedSales';
const defaultSales = [
  { date: '2025-06-24', total: 500 },
  { date: '2025-06-25', total: 650 },
];
function getSales() {
  const data = localStorage.getItem(SALES_KEY);
  return data ? JSON.parse(data) : defaultSales;
}
const ManagerSales: React.FC = () => {
  const [sales, setSales] = useState<any[]>(getSales());
  useEffect(() => {
    const sync = () => setSales(getSales());
    window.addEventListener('storage', sync);
    const interval = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Sales Analytics</h1>
      <table className="w-full text-left border mb-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s: any) => (
            <tr key={s.date} className="border-t">
              <td className="p-2">{s.date}</td>
              <td className="p-2">${s.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerSales;
