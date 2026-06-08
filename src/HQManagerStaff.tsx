import React, { useEffect, useState } from 'react';

const STAFF_KEY = 'sharedStaff';
const defaultStaff = [
  { id: 1, name: 'Alice', branch: 'Downtown', role: 'Waiter', active: true },
  { id: 2, name: 'Bob', branch: 'Uptown', role: 'Chef', active: true },
  { id: 3, name: 'Charlie', branch: 'Suburb', role: 'Cashier', active: false },
];
function getStaff() {
  const data = localStorage.getItem(STAFF_KEY);
  return data ? JSON.parse(data) : defaultStaff;
}
function setStaffData(data: any[]) {
  localStorage.setItem(STAFF_KEY, JSON.stringify(data));
}

const HQManagerStaff: React.FC = () => {
  const [staff, setStaff] = useState<any[]>(getStaff());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  useEffect(() => {
    const sync = () => setStaff(getStaff());
    window.addEventListener('storage', sync);
    const interval = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(interval);
    };
  }, []);
  const handleToggleActive = (id: number) => {
    const updated = staff.map((s: any) => s.id === id ? { ...s, active: !s.active } : s);
    setStaff(updated);
    setStaffData(updated);
  };
  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditItem({ ...item });
  };
  const handleEditSave = () => {
    const updated = staff.map((s: any) => s.id === editingId ? { ...editItem } : s);
    setStaff(updated);
    setStaffData(updated);
    setEditingId(null);
    setEditItem(null);
  };
  const handleEditCancel = () => {
    setEditingId(null);
    setEditItem(null);
  };
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">All Branch Staff</h1>
      <table className="w-full text-left border mb-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Branch</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s: any) => (
            <tr key={s.id} className="border-t">
              {editingId === s.id ? (
                <>
                  <td className="p-2">
                    <input className="border p-1 rounded w-full" value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} />
                  </td>
                  <td className="p-2">
                    <input className="border p-1 rounded w-full" value={editItem.branch} onChange={e => setEditItem({ ...editItem, branch: e.target.value })} />
                  </td>
                  <td className="p-2">
                    <input className="border p-1 rounded w-full" value={editItem.role} onChange={e => setEditItem({ ...editItem, role: e.target.value })} />
                  </td>
                  <td className="p-2">
                    <button className={`px-2 py-1 rounded text-xs ${editItem.active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`} onClick={() => setEditItem({ ...editItem, active: !editItem.active })}>
                      {editItem.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button className="bg-green-600 text-white px-2 py-1 rounded text-xs" onClick={handleEditSave}>Save</button>
                    <button className="bg-gray-400 text-white px-2 py-1 rounded text-xs" onClick={handleEditCancel}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.branch}</td>
                  <td className="p-2">{s.role}</td>
                  <td className="p-2">
                    <button className={`px-2 py-1 rounded text-xs ${s.active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`} onClick={() => handleToggleActive(s.id)}>
                      {s.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs" onClick={() => handleEdit(s)}>Edit</button>
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

export default HQManagerStaff;
