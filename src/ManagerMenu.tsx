import React, { useEffect, useState } from 'react';

const MENU_KEY = 'sharedMenuByBranch';
function getCurrentBranch() {
  const user = localStorage.getItem('currentUser');
  if (!user) return null;
  try {
    const parsed = JSON.parse(user);
    // If admin, allow branch selection via a dropdown (see below)
    if (parsed.role === 'admin') {
      const adminBranch = localStorage.getItem('adminSelectedBranch');
      return adminBranch || null;
    }
    return parsed.branch || null;
  } catch {
    return null;
  }
}
function getMenu() {
  const branch = getCurrentBranch();
  if (!branch) return [];
  const data = localStorage.getItem(MENU_KEY);
  if (!data) return [];
  const allMenus = JSON.parse(data);
  return allMenus[branch] || [];
}
function setMenu(data: any[]) {
  const branch = getCurrentBranch();
  if (!branch) return;
  const allMenus = localStorage.getItem(MENU_KEY);
  let menus = allMenus ? JSON.parse(allMenus) : {};
  menus[branch] = data;
  localStorage.setItem(MENU_KEY, JSON.stringify(menus));
}
const categories = ['Appetizers', 'Mains', 'Desserts', 'Drinks'];

const ManagerMenu: React.FC = () => {
  const [menu, setMenuState] = useState<any[]>(getMenu());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({ name: '', category: categories[0], price: '' });
  const [adminBranch, setAdminBranch] = useState<string | null>(null);

  // Fetch all branches for admin dropdown
  const [branches, setBranches] = useState<string[]>([]);
  useEffect(() => {
    const branchesData = localStorage.getItem('branches');
    if (branchesData) {
      setBranches(JSON.parse(branchesData));
    }
  }, []);

  // Always show branch selector and reload menu when branch changes (for both admin and manager)
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
      setMenuState(getMenu());
    } else if (role === 'manager') {
      // For manager, branch is fixed, but reload menu if branch changes
      setMenuState(getMenu());
    }
  }, [branches, adminBranch]);

  // When branch is changed (admin), update localStorage and reload menu
  const handleAdminBranchChange = (branch: string) => {
    localStorage.setItem('adminSelectedBranch', branch);
    setAdminBranch(branch);
    setMenuState(getMenu());
  };

  useEffect(() => {
    const sync = () => setMenuState(getMenu());
    window.addEventListener('storage', sync);
    const interval = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(interval);
    };
  }, []);

  const handleDelete = (id: number) => {
    const updated = menu.filter(item => item.id !== id);
    setMenuState(updated);
    setMenu(updated);
  };
  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditItem({ ...item });
  };
  const handleEditSave = () => {
    const updated = menu.map(item => item.id === editingId ? { ...editItem, price: Number(editItem.price) } : item);
    setMenuState(updated);
    setMenu(updated);
    setEditingId(null);
    setEditItem(null);
  };
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.category || !newItem.price) return;
    const updated = [
      ...menu,
      { id: Date.now(), name: newItem.name, category: newItem.category, price: Number(newItem.price) }
    ];
    setMenuState(updated);
    setMenu(updated);
    setNewItem({ name: '', category: categories[0], price: '' });
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Menu Overview</h1>
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
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2 mb-6 items-end">
        <input className="border p-2 rounded flex-1" placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
        <select className="border p-2 rounded" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="border p-2 rounded flex-1" placeholder="Price" type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Add Menu Item</button>
      </form>
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item: any) => (
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

export default ManagerMenu;
