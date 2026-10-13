import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { User, Phone, Mail, Shield, Save, CheckCircle2, AlertCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await authService.updateProfile({ name, phone });
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 4rem 1.5rem', maxWidth: '580px' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
          User Profile & Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '2rem' }}>
          Manage your personal contact details for collection notifications
        </p>

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            <CheckCircle2 size={18} />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Registered)</label>
            <input
              type="email"
              className="form-control"
              value={user?.email || ''}
              disabled
              style={{ background: 'var(--bg-main)' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Role</label>
            <input
              type="text"
              className="form-control"
              value={user?.role?.toUpperCase() || 'USER'}
              disabled
              style={{ background: 'var(--bg-main)', fontWeight: 600 }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
