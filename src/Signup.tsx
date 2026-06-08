import React, { useState } from 'react';

const Signup: React.FC = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    try {
      const res = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        // Save role as CUSTOMER in localStorage and redirect to menu
        localStorage.setItem('role', 'CUSTOMER');
        window.location.href = '/menu';
        return;
      } else {
        const text = await res.text();
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch {}
        setError(data.message || text || 'Sign up failed. Please try again.');
      }
    } catch (err: any) {
      setError('Network error: ' + (err?.message || err));
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>
      <div className="card" style={{ maxWidth: 400, margin: '2rem auto' }}>
        {error && (
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        )}
        {success ? (
          <p style={{ color: '#e0b07d', textAlign: 'center' }}>Sign up successful! You can now log in.</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label>
              Username
              <input type="text" name="username" value={form.username} onChange={handleChange} required />
            </label>
            <label>
              Password
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </label>
            <button type="submit" className="btn">Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
