import React, { useState } from 'react';

const Login: React.FC = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const appendAccessLog = (user: string, action: string) => {
    const logs = JSON.parse(localStorage.getItem('accessLogs') || '[]');
    logs.push({
      user,
      action,
      time: new Date().toLocaleString('sv-SE', { hour12: false })
    });
    localStorage.setItem('accessLogs', JSON.stringify(logs));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        // Save role in localStorage
        if (data && data.user && data.user.role) {
          localStorage.setItem('role', data.user.role);
          appendAccessLog(data.user.username || form.username, 'Login Success');
          if (data.user.role === 'ADMIN') {
            window.location.href = '/admin';
            return;
          }
          if (data.user.role === 'MANAGER') {
            window.location.href = '/manager';
            return;
          }
          if (data.user.role === 'HQMANAGER' || data.user.role === 'HQ_MANAGER') {
            window.location.href = '/hqmanager';
            return;
          }
          if (data.user.role === 'CHEF') {
            window.location.href = '/chef';
            return;
          }
          if (data.user.role === 'CUSTOMER') {
            window.location.href = '/menu';
            return;
          }
          // Add redirect for CASHIER and WAITER_CASHIER roles
          if (data.user.role === 'CASHIER' || data.user.role === 'WAITER_CASHIER') {
            window.location.href = '/cashier';
            return;
          }
        }
      } else {
        const text = await res.text();
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch {}
        setError(data.message || text || 'Login failed. Please try again.');
        appendAccessLog(form.username, 'Login Fail');
      }
    } catch (err: any) {
      setError('Network error: ' + (err?.message || err));
      appendAccessLog(form.username, 'Login Fail');
    }
  };

  return (
    <div className="container">
      <h1>Log In</h1>
      <div className="card" style={{ maxWidth: 400, margin: '2rem auto' }}>
        {error && (
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label>
            Username
            <input type="text" name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          <button type="submit" className="btn">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
