import React, { useEffect, useState } from 'react';

const INVENTORY_KEY = 'sharedInventory';
const defaultInventory = [
  { id: 1, name: 'Beef', branch: 'Downtown', quantity: 10, unit: 'kg', low: false },
  { id: 2, name: 'Lettuce', branch: 'Uptown', quantity: 2, unit: 'kg', low: true },
];
function getInventory() {
  const data = localStorage.getItem(INVENTORY_KEY);
  return data ? JSON.parse(data) : defaultInventory;
}
const HQManagerInventory: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>(getInventory());
  useEffect(() => {
    const sync = () => setInventory(getInventory());
    window.addEventListener('storage', sync);
    const interval = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">All Branch Inventory</h1>
      <table className="w-full text-left border mb-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Item</th>
            <th className="p-2">Branch</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((i: any) => (
            <tr key={i.id} className="border-t">
              <td className="p-2">{i.name}</td>
              <td className="p-2">{i.branch}</td>
              <td className="p-2">{i.quantity}</td>
              <td className="p-2">{i.unit}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs ${i.low ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{i.low ? 'Low' : 'OK'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HQManagerInventory;
