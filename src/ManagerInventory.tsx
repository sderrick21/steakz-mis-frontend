import React, { useEffect, useState } from 'react';

const INVENTORY_KEY = 'sharedInventoryByBranch';
function getInventoryCurrentBranch() {
  const user = localStorage.getItem('currentUser');
  if (!user) return null;
  try {
    const parsed = JSON.parse(user);
    if (parsed.role === 'admin') {
      const adminBranch = localStorage.getItem('adminSelectedBranch');
      return adminBranch || null;
    }
    return parsed.branch || null;
  } catch {
    return null;
  }
}
function getInventory() {
  const branch = getInventoryCurrentBranch();
  if (!branch) return [];
  const data = localStorage.getItem(INVENTORY_KEY);
  if (!data) return [];
  const allInventories = JSON.parse(data);
  return allInventories[branch] || [];
}

const ManagerInventory: React.FC = () => {
  const [inventory, setInventoryState] = useState<any[]>(getInventory());
  const [adminBranch, setAdminBranch] = useState<string | null>(null);

  // Fetch all branches for admin dropdown
  const [branches, setBranches] = useState<string[]>([]);
  useEffect(() => {
    const branchesData = localStorage.getItem('branches');
    if (branchesData) {
      setBranches(JSON.parse(branchesData));
    }
  }, []);

  // If admin, allow branch selection
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user && JSON.parse(user).role === 'admin') {
      const selected = localStorage.getItem('adminSelectedBranch');
      setAdminBranch(selected || (branches[0] || null));
    }
  }, [branches]);

  // Always show branch selector and reload inventory when branch changes (for both admin and manager)
  useEffect(() => {
    let user = localStorage.getItem('currentUser');
    let role = user ? JSON.parse(user).role : null;
    let selected = adminBranch;
    if (role === 'admin') {
      selected = localStorage.getItem('adminSelectedBranch');
      if (!selected && branches.length > 0) {
        selected = branches[0];
        localStorage.setItem('adminSelectedBranch', selected);
      }
      setAdminBranch(selected || (branches[0] || null));
      setInventoryState(getInventory());
    } else if (role === 'manager') {
      setInventoryState(getInventory());
    }
  }, [branches, adminBranch]);

  // When branch is changed (admin), update localStorage and reload inventory
  const handleAdminBranchChange = (branch: string) => {
    localStorage.setItem('adminSelectedBranch', branch);
    setAdminBranch(branch);
    setInventoryState(getInventory());
  };

  useEffect(() => {
    const sync = () => setInventoryState(getInventory());
    window.addEventListener('storage', sync);
    const interval = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Inventory Overview</h1>
      {/* Branch selector for both admin and manager */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Branch:</label>
        <select
          className="border p-2 rounded"
          value={adminBranch || branches[0] || ''}
          onChange={e => handleAdminBranchChange(e.target.value)}
        >
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <table className="w-full text-left border mb-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Item</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((i: any) => (
            <tr key={i.id} className="border-t">
              <td className="p-2">{i.name}</td>
              <td className="p-2">{i.quantity}</td>
              <td className="p-2">{i.unit}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs ${i.low ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{i.low ? 'Low' : 'OK'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table    >
    </div>
  );
};

export default ManagerInventory;
