import React, { useEffect, useState } from 'react';

const INVENTORY_KEY = 'sharedInventory';
type InventoryItem = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
};
// Use branch-specific inventory for all CRUD operations
function getInventoryForBranch(branch: string): InventoryItem[] {
  const data = localStorage.getItem('sharedInventoryByBranch');
  if (!data) return [];
  const allInventories = JSON.parse(data);
  return branch ? (allInventories[branch] || []) : [];
}
function setInventoryForBranch(branch: string, data: InventoryItem[]) {
  const allDataRaw = localStorage.getItem('sharedInventoryByBranch');
  let allData = allDataRaw ? JSON.parse(allDataRaw) : {};
  allData[branch] = data;
  localStorage.setItem('sharedInventoryByBranch', JSON.stringify(allData));
}

const InventoryManagement: React.FC = () => {
  // Fetch branches and set default branch for admin
  const [branches] = useState(['downtown', 'uptown', 'suburb']);
  const [branch, setBranch] = useState('downtown');
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '', threshold: '' });

  useEffect(() => {
    setLoading(true);
    // Load inventory for selected branch
    const all = JSON.parse(localStorage.getItem('sharedInventoryByBranch') || '{}');
    setInventory(all[branch] || []);
    setLoading(false);
    // Real-time sync
    const sync = () => {
      const all = JSON.parse(localStorage.getItem('sharedInventoryByBranch') || '{}');
      setInventory(all[branch] || []);
    };
    window.addEventListener('storage', sync);
    const interval = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(interval);
    };
  }, [branch]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity || !newItem.unit || !newItem.threshold) return;
    const updated: InventoryItem[] = [
      ...inventory,
      { id: Date.now(), name: newItem.name, quantity: Number(newItem.quantity), unit: newItem.unit, threshold: Number(newItem.threshold) }
    ];
    setInventory(updated);
    setInventoryForBranch(branch, updated);
    setNewItem({ name: '', quantity: '', unit: '', threshold: '' });
  };

  const handleDelete = (id: number) => {
    const updated = inventory.filter((item: InventoryItem) => item.id !== id);
    setInventory(updated);
    setInventoryForBranch(branch, updated);
  };

  const handleUpdate = (id: number, field: string, value: string) => {
    const updated = inventory.map((item: InventoryItem) =>
      item.id === id ? { ...item, [field]: field === 'name' || field === 'unit' ? value : Number(value) } : item
    );
    setInventory(updated);
    setInventoryForBranch(branch, updated);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Branch:</label>
        <select className="border p-2 rounded" value={branch} onChange={e => setBranch(e.target.value)}>
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2 mb-6 items-end">
        <input className="border p-2 rounded flex-1" placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
        <input className="border p-2 rounded flex-1" placeholder="Quantity" type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} />
        <input className="border p-2 rounded flex-1" placeholder="Unit" value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })} />
        <input className="border p-2 rounded flex-1" placeholder="Threshold" type="number" value={newItem.threshold} onChange={e => setNewItem({ ...newItem, threshold: e.target.value })} />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Add Item</button>
      </form>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Threshold</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item: InventoryItem) => (
              <tr key={item.id} className="border-t">
                <td className="p-2">
                  <input className="border p-1 rounded w-full" value={item.name} onChange={e => handleUpdate(item.id, 'name', e.target.value)} />
                </td>
                <td className="p-2">
                  <input className="border p-1 rounded w-20" type="number" value={item.quantity} onChange={e => handleUpdate(item.id, 'quantity', e.target.value)} />
                </td>
                <td className="p-2">
                  <input className="border p-1 rounded w-20" value={item.unit} onChange={e => handleUpdate(item.id, 'unit', e.target.value)} />
                </td>
                <td className="p-2">
                  <input className="border p-1 rounded w-20" type="number" value={item.threshold} onChange={e => handleUpdate(item.id, 'threshold', e.target.value)} />
                </td>
                <td className="p-2">
                  {item.quantity <= item.threshold ? (
                    <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">Low</span>
                  ) : (
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">OK</span>
                  )}
                </td>
                <td className="p-2">
                  <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryManagement;
