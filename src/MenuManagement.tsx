import React, { useState, useEffect } from 'react';

const MENU_BRANCH_KEY = 'sharedMenuByBranch';
const categories = ['Appetizers', 'Mains', 'Desserts', 'Drinks'];

const baseMenu = [
  { id: 1, name: 'Ribeye Steak', category: 'Mains', available: true, price: 32 },
  { id: 2, name: 'Caesar Salad', category: 'Appetizers', available: true, price: 12 },
  { id: 3, name: 'Chocolate Lava Cake', category: 'Desserts', available: false, price: 10 },
  { id: 4, name: 'Lemonade', category: 'Drinks', available: true, price: 5 },
  { id: 5, name: 'Grilled Salmon', category: 'Mains', available: true, price: 28 },
  { id: 6, name: 'French Fries', category: 'Appetizers', available: true, price: 8 },
  { id: 7, name: 'Garden Salad', category: 'Appetizers', available: true, price: 10 },
  { id: 8, name: 'Iced Tea', category: 'Drinks', available: true, price: 4 },
  { id: 9, name: 'Tiramisu', category: 'Desserts', available: true, price: 9 },
  { id: 10, name: 'Chicken Wings', category: 'Appetizers', available: true, price: 14 }
];

function getBranchMenus() {
  const data = localStorage.getItem(MENU_BRANCH_KEY);
  return data ? JSON.parse(data) : {};
}
function setBranchMenus(allMenus: any) {
  localStorage.setItem(MENU_BRANCH_KEY, JSON.stringify(allMenus));
}
function getMenuForBranch(branch: string) {
  const allMenus = getBranchMenus();
  return allMenus[branch] && allMenus[branch].length > 0 ? allMenus[branch] : baseMenu;
}
function setMenuForBranch(branch: string, menu: any[]) {
  const allMenus = getBranchMenus();
  allMenus[branch] = menu;
  setBranchMenus(allMenus);
}

const MenuManagement: React.FC = () => {
  const [branch, setBranch] = useState<string>('');
  const [branches, setBranches] = useState<string[]>([]);
  const [menu, setMenu] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({ name: '', category: categories[0], price: '', available: true });
  const [usingBase, setUsingBase] = useState(false);

  useEffect(() => {
    const branchList = ['downtown', 'uptown', 'suburb'];
    setBranches(branchList);
    if (!branch) setBranch(branchList[0]);
  }, []);

  useEffect(() => {
    const allMenus = getBranchMenus();
    let branchMenu = branch ? (allMenus[branch] || []) : [];
    if (branchMenu.length === 0) {
      setMenu(baseMenu);
      setUsingBase(true);
    } else {
      setMenu(branchMenu);
      setUsingBase(false);
    }
    // Real-time sync
    const sync = () => {
      const allMenus = getBranchMenus();
      let branchMenu = branch ? (allMenus[branch] || []) : [];
      if (branchMenu.length === 0) {
        setMenu(baseMenu);
        setUsingBase(true);
      } else {
        setMenu(branchMenu);
        setUsingBase(false);
      }
    };
    window.addEventListener('storage', sync);
    const interval = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(interval);
    };
  }, [branch]);

  const handleBranchChange = (branch: string) => {
    setBranch(branch);
    setEditingId(null);
    setEditItem(null);
  };

  const ensureBranchMenu = () => {
    // If branch has no menu, create it from baseMenu
    const allMenus = getBranchMenus();
    if (!allMenus[branch] || allMenus[branch].length === 0) {
      allMenus[branch] = baseMenu.map(item => ({ ...item, id: Date.now() + Math.random() }));
      setBranchMenus(allMenus);
    }
  };

  const handleDelete = (id: number) => {
    ensureBranchMenu();
    const allMenus = getBranchMenus();
    const updated = (allMenus[branch] || baseMenu).filter((item: any) => item.id !== id);
    setMenu(updated);
    setMenuForBranch(branch, updated);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditItem({ ...item });
  };

  const handleEditSave = () => {
    ensureBranchMenu();
    const allMenus = getBranchMenus();
    const updated = (allMenus[branch] || baseMenu).map((item: any) => item.id === editingId ? { ...editItem, price: Number(editItem.price) } : item);
    setMenu(updated);
    setMenuForBranch(branch, updated);
    setEditingId(null);
    setEditItem(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.category || !newItem.price) return;
    ensureBranchMenu();
    const allMenus = getBranchMenus();
    const updated = [
      ...(allMenus[branch] || baseMenu),
      { id: Date.now() + Math.random(), name: newItem.name, category: newItem.category, price: Number(newItem.price), available: newItem.available }
    ];
    setMenu(updated);
    setMenuForBranch(branch, updated);
    setNewItem({ name: '', category: categories[0], price: '', available: true });
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Menu Management</h1>
      {/* Branch selector for admin/manager */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Branch:</label>
        <select className="border p-2 rounded" value={branch} onChange={e => handleBranchChange(e.target.value)}>
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        {usingBase && <span className="ml-4 text-sm text-gray-500">(Using base menu, will create branch menu on first edit)</span>}
      </div>
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2 mb-6 items-end">
        <input className="border p-2 rounded flex-1" placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
        <select className="border p-2 rounded" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="border p-2 rounded flex-1" placeholder="Price" type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={newItem.available} onChange={e => setNewItem({ ...newItem, available: e.target.checked })} />
          Available
        </label>
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Add Menu Item</button>
      </form>
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
            <th className="p-2">Available</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.map(item => (
            <tr key={item.id} className="border-t">
              {editingId === item.id ? (
                <>
                  <td className="p-2"><input className="border p-1 rounded w-full" value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} /></td>
                  <td className="p-2">
                    <select className="border p-1 rounded" value={editItem.category} onChange={e => setEditItem({ ...editItem, category: e.target.value })}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="p-2"><input className="border p-1 rounded w-20" type="number" value={editItem.price} onChange={e => setEditItem({ ...editItem, price: e.target.value })} /></td>
                  <td className="p-2">
                    <input type="checkbox" checked={editItem.available} onChange={e => setEditItem({ ...editItem, available: !editItem.available })} />
                  </td>
                  <td className="p-2 flex gap-2">
                    <button className="bg-green-600 text-white px-2 py-1 rounded text-xs" type="button" onClick={handleEditSave}>Save</button>
                    <button className="bg-gray-400 text-white px-2 py-1 rounded text-xs" type="button" onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">${item.price}</td>
                  <td className="p-2">{item.available ? 'Yes' : 'No'}</td>
                  <td className="p-2 flex gap-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs" type="button" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" type="button" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuManagement;
