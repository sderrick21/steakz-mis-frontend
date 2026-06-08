import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN' && role !== 'admin') {
      history.replace('/');
    }
  }, [history]);

  // Mock data for demonstration
  const menuItems = [
    { id: 1, name: 'Ribeye Steak', category: 'Mains', available: true, price: 32, },
    { id: 2, name: 'Caesar Salad', category: 'Appetizers', available: true, price: 12, },
    { id: 3, name: 'Chocolate Lava Cake', category: 'Desserts', available: false, price: 10, },
  ];
  const employees = [
    { id: 1, name: 'Alice', role: 'Manager', active: true },
    { id: 2, name: 'Bob', role: 'Cashier', active: true },
    { id: 3, name: 'Charlie', role: 'Waiter', active: false },
  ];
  const reservations = [
    { id: 1, name: 'John Doe', table: 5, time: '7:00 PM', status: 'Reserved' },
    { id: 2, name: 'Jane Smith', table: 2, time: '8:00 PM', status: 'Occupied' },
  ];
  const tables = [
    { id: 1, number: 1, status: 'Available' },
    { id: 2, number: 2, status: 'Occupied' },
    { id: 3, number: 3, status: 'Reserved' },
    { id: 4, number: 4, status: 'Maintenance' },
  ];
  const notifications = [
    { id: 1, message: 'System update completed', time: 'Today 10:00 AM' },
    { id: 2, message: 'Reservation cancelled by user', time: 'Yesterday 6:30 PM' },
  ];
  const logs = [
    { id: 1, action: 'Added menu item', user: 'admin', time: 'Today 9:00 AM' },
    { id: 2, action: 'Deactivated employee', user: 'admin', time: 'Yesterday 5:00 PM' },
  ];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {/* 1. Menu Management */}
      <section className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Menu Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {menuItems.map(item => (
            <div key={item.id} className="border rounded p-2 flex flex-col items-center">
              <div className="font-bold">{item.name}</div>
              <div className="text-sm text-gray-500">{item.category}</div>
              <div className="text-green-700 font-semibold">${item.price}</div>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded text-xs ${item.available ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{item.available ? 'Available' : 'Unavailable'}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Edit</button>
                <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Add Menu Item</button>
      </section>

      {/* 2. Employee Management */}
      <section className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Employee Management</h2>
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="border-t">
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.role}</td>
                <td className="p-2">{emp.active ? 'Active' : 'Inactive'}</td>
                <td className="p-2 flex gap-2">
                  <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Edit</button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Add Employee</button>
      </section>

      {/* 3. Sales & Analytics */}
      <section className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Sales & Analytics</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-gray-50 rounded p-4">
            <div className="font-bold mb-2">Sales Stats</div>
            <div className="text-sm">Today: $1,200</div>
            <div className="text-sm">This Week: $8,400</div>
            <div className="text-sm">This Month: $32,000</div>
          </div>
          <div className="flex-1 bg-gray-50 rounded p-4">
            <div className="font-bold mb-2">Best Sellers</div>
            <ul className="list-disc ml-5 text-sm">
              <li>Ribeye Steak</li>
              <li>Caesar Salad</li>
            </ul>
          </div>
          <div className="flex-1 bg-gray-50 rounded p-4">
            <div className="font-bold mb-2">Revenue Trend</div>
            <div className="h-24 flex items-center justify-center text-gray-400">[Chart]</div>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Export Report</button>
      </section>

      {/* 4. Business Settings */}
      <section className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Business Settings</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="font-bold">Business Hours</div>
            <div className="text-sm">Mon-Sun: 11:00 AM - 11:00 PM</div>
            <button className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs">Edit</button>
          </div>
          <div className="flex-1">
            <div className="font-bold">Contact Info</div>
            <div className="text-sm">Phone: (555) 123-4567</div>
            <div className="text-sm">Email: info@staceysteakz.com</div>
            <button className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs">Edit</button>
          </div>
          <div className="flex-1">
            <div className="font-bold">Online Ordering</div>
            <div className="text-sm">Enabled</div>
            <button className="mt-2 px-2 py-1 bg-yellow-500 text-white rounded text-xs">Toggle</button>
          </div>
        </div>
      </section>

      {/* 5. Table & Reservation Overview */}
      <section className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Table & Reservation Overview</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="font-bold mb-2">Upcoming Reservations</div>
            <ul className="list-disc ml-5 text-sm">
              {reservations.map(r => (
                <li key={r.id}>{r.name} - Table {r.table} at {r.time} ({r.status})</li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <div className="font-bold mb-2">Table Status</div>
            <ul className="list-disc ml-5 text-sm">
              {tables.map(t => (
                <li key={t.id}>Table {t.number}: {t.status}</li>
              ))}
            </ul>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded">Block Table</button>
      </section>

      {/* 6. Notifications & System Logs */}
      <section className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Notifications & System Logs</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="font-bold mb-2">Notifications</div>
            <ul className="list-disc ml-5 text-sm">
              {notifications.map(n => (
                <li key={n.id}>{n.message} <span className="text-gray-400 text-xs">({n.time})</span></li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <div className="font-bold mb-2">System Logs</div>
            <ul className="list-disc ml-5 text-sm">
              {logs.map(l => (
                <li key={l.id}>{l.action} by {l.user} <span className="text-gray-400 text-xs">({l.time})</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
