import React, { useEffect, useState } from 'react';

const STAFF_KEY = 'sharedStaff';
const defaultStaff = [
  { id: 1, name: 'Alice', role: 'Waiter', active: true },
  { id: 2, name: 'Bob', role: 'Chef', active: true },
  { id: 3, name: 'Charlie', role: 'Cashier', active: false },
];
function getStaff() {
  const data = localStorage.getItem(STAFF_KEY);
  return data ? JSON.parse(data) : defaultStaff;
}
function setStaffData(data: any[]) {
  localStorage.setItem(STAFF_KEY, JSON.stringify(data));
}

const ManagerStaff: React.FC = () => {
  const [staff, setStaff] = useState<any[]>(getStaff());
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
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Branch Staff</h1>
      <table className="w-full text-left border mb-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s: any) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.role}</td>
              <td className="p-2">
                <button className={`px-2 py-1 rounded text-xs ${s.active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`} onClick={() => handleToggleActive(s.id)}>
                  {s.active ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className="p-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerStaff;
