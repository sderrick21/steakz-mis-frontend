import React, { useEffect, useState } from 'react';

// Utility to get logs from localStorage
function getAccessLogs() {
  const logs = localStorage.getItem('accessLogs');
  return logs ? JSON.parse(logs) : [];
}

const AccessLog: React.FC = () => {
  const [logs, setLogs] = useState<any[]>(getAccessLogs());

  useEffect(() => {
    // Listen for storage changes (in case logs are updated elsewhere)
    const onStorage = () => setLogs(getAccessLogs());
    window.addEventListener('storage', onStorage);
    // Poll for changes in this tab as well
    const interval = setInterval(() => setLogs(getAccessLogs()), 1000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Access Log</h1>
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">User</th>
            <th className="p-2">Action</th>
            <th className="p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 && (
            <tr><td className="p-2" colSpan={3}>No login activity yet.</td></tr>
          )}
          {logs.slice(-20).reverse().map((log, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{log.user}</td>
              <td className="p-2">{log.action}</td>
              <td className="p-2">{log.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessLog;
