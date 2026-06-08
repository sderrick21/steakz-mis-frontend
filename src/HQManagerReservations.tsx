import React, { useEffect, useState } from 'react';

const RESERVATIONS_KEY = 'sharedReservations';
const defaultReservations = [
  { id: 1, name: 'John Doe', branch: 'Downtown', table: 5, time: '7:00 PM', status: 'Reserved' },
  { id: 2, name: 'Jane Smith', branch: 'Uptown', table: 2, time: '8:00 PM', status: 'Occupied' },
];
function getReservations() {
  const data = localStorage.getItem(RESERVATIONS_KEY);
  return data ? JSON.parse(data) : defaultReservations;
}
const HQManagerReservations: React.FC = () => {
  const [reservations, setReservations] = useState<any[]>(getReservations());
  useEffect(() => {
    const sync = () => setReservations(getReservations());
    window.addEventListener('storage', sync);
    const interval = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">All Branch Reservations</h1>
      <table className="w-full text-left border mb-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Branch</th>
            <th className="p-2">Table</th>
            <th className="p-2">Time</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r: any) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.name}</td>
              <td className="p-2">{r.branch}</td>
              <td className="p-2">{r.table}</td>
              <td className="p-2">{r.time}</td>
              <td className="p-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HQManagerReservations;
