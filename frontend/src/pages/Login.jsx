import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMusic } from 'react-icons/fa';
import api from '../api';

export default function Login() {
  const demoEmail = import.meta.env.VITE_DEMO_EMAIL || 'admin@musicschool.com';
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || '';
  const demoAvailable = Boolean(demoEmail && demoPassword);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleDemo = () => {
    if (!demoAvailable) {
      setError('Demo credentials are unavailable in this local environment.');
      return;
    }
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="icon"><FaMusic /></div>
          <h1>Music School</h1>
          <p>Academy Manager</p>
        </div>
        {error && <div className="login-error">{error}</div>}
        <form id="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="login-buttons">
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <button
              type="button"
              className="btn btn-gold btn-full"
              onClick={handleDemo}
              disabled={loading || !demoAvailable}
              title={demoAvailable ? 'Fill the configured local demo account' : 'Configure DEMO_PASSWORD for local demo access'}
            >
              Fill Demo Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
