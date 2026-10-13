import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Shield, Truck, User } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await login(email, password);
      const userRole = res.data.user.role;

      if (from) {
        navigate(from, { replace: true });
      } else if (userRole === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else if (userRole === 'recycler') {
        navigate('/recycler-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to backend server. Please make sure the backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Demo credential autofill for easy demonstration
  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@ecoconnect.org');
      setPassword('AdminPassword123!');
    } else if (role === 'recycler') {
      setEmail('recycler@greencycle.org');
      setPassword('RecyclerPassword123!');
    } else if (role === 'user') {
      setEmail('user@ecoconnect.org');
      setPassword('UserPassword123!');
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '480px' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.4rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Log in to manage your e-waste requests and collection records
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            <LogIn size={18} />
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem', textAlign: 'center' }}>
            Demo Fast Fill (CEP Presentation)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setDemoCredentials('user')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.2rem' }}
            >
              <User size={12} /> Resident
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('recycler')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.2rem' }}
            >
              <Truck size={12} /> Recycler
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.2rem' }}
            >
              <Shield size={12} /> Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Register as User
          </Link>
          {' · '}
          <Link to="/register-recycler" style={{ color: 'var(--secondary)', fontWeight: 600 }}>
            Join as Recycler
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
