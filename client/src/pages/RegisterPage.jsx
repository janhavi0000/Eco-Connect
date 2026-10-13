import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'user'
      });
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to backend server. Please make sure the backend is running on port 5000.');
      } else {
        const msg =
          err.response?.data?.message ||
          (err.response?.data?.errors && err.response.data.errors.join(', ')) ||
          'Registration failed. Please check your details.';
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '500px' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            <span>Community Member Account</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Join EcoConnect
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Schedule convenient pickups and track your household's recycling contributions
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
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Alex Rivera"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="+1-555-0123"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Confirm Password <span className="required">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={submitting}
          >
            <UserPlus size={18} />
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In
          </Link>
          <div style={{ marginTop: '0.5rem' }}>
            Are you an e-waste recycler or collector?{' '}
            <Link to="/register-recycler" style={{ color: 'var(--secondary)', fontWeight: 600 }}>
              Register as Recycler
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
