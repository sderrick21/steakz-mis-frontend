import React, { useState } from 'react';

const initialBranches = [
  { id: 1, name: 'Downtown', location: '123 Main St', active: true },
  { id: 2, name: 'Uptown', location: '456 Oak Ave', active: false },
  { id: 3, name: 'Suburb', location: '789 Pine Rd', active: true },
];

const BranchManagement: React.FC = () => {
  const [branches, setBranches] = useState(initialBranches);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBranch, setEditBranch] = useState<any>(null);
  const [newBranch, setNewBranch] = useState({ name: '', location: '', active: true });

  const handleDelete = (id: number) => {
    setBranches(branches.filter(branch => branch.id !== id));
  };

  const handleEdit = (branch: any) => {
    setEditingId(branch.id);
    setEditBranch({ ...branch });
  };

  const handleEditSave = () => {
    setBranches(branches.map(branch => branch.id === editingId ? { ...editBranch } : branch));
    setEditingId(null);
    setEditBranch(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.name || !newBranch.location) return;
    setBranches([
      ...branches,
      { id: Date.now(), name: newBranch.name, location: newBranch.location, active: newBranch.active }
    ]);
    setNewBranch({ name: '', location: '', active: true });
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Branch Management</h1>
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2 mb-6 items-end">
        <input className="border p-2 rounded flex-1" placeholder="Branch Name" value={newBranch.name} onChange={e => setNewBranch({ ...newBranch, name: e.target.value })} />
        <input className="border p-2 rounded flex-1" placeholder="Location" value={newBranch.location} onChange={e => setNewBranch({ ...newBranch, location: e.target.value })} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={newBranch.active} onChange={e => setNewBranch({ ...newBranch, active: e.target.checked })} />
          Active
        </label>
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Add Branch</button>
      </form>
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Location</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {branches.map(branch => (
            <tr key={branch.id} className="border-t">
              {editingId === branch.id ? (
                <>
                  <td className="p-2"><input className="border p-1 rounded w-full" value={editBranch.name} onChange={e => setEditBranch({ ...editBranch, name: e.target.value })} /></td>
                  <td className="p-2"><input className="border p-1 rounded w-full" value={editBranch.location} onChange={e => setEditBranch({ ...editBranch, location: e.target.value })} /></td>
                  <td className="p-2">
                    <input type="checkbox" checked={editBranch.active} onChange={e => setEditBranch({ ...editBranch, active: !editBranch.active })} />
                    <span className="ml-2">{editBranch.active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button className="bg-green-600 text-white px-2 py-1 rounded text-xs" type="button" onClick={handleEditSave}>Save</button>
                    <button className="bg-gray-400 text-white px-2 py-1 rounded text-xs" type="button" onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{branch.name}</td>
                  <td className="p-2">{branch.location}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${branch.active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{branch.active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs" type="button" onClick={() => handleEdit(branch)}>Edit</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" type="button" onClick={() => handleDelete(branch.id)}>Delete</button>
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

export default BranchManagement;
