import React, { useState, useEffect } from 'react';
import { recyclerService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Save, CheckCircle2, AlertCircle, Building2, Calendar, Layers, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecyclerProfilePage = () => {
  const { recycler, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState({
    organizationName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    serviceAreasInput: '',
    description: '',
    supportedCategories: [],
    availableDays: [],
    timeSlots: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const allCategories = [
    'Mobile Phones',
    'Chargers / Cables',
    'Batteries',
    'Laptops / Computers',
    'Keyboards',
    'Earphones / Headphones',
    'Tablets',
    'Monitors',
    'Other Electronic Devices'
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await recyclerService.getMyProfile();
        if (res.data?.success) {
          const rec = res.data.data;
          setProfileData({
            organizationName: rec.organizationName || '',
            contactPerson: rec.contactPerson || '',
            phone: rec.phone || '',
            email: rec.email || '',
            address: rec.address || '',
            serviceAreasInput: rec.serviceAreas ? rec.serviceAreas.join(', ') : '',
            description: rec.description || '',
            supportedCategories: rec.supportedCategories || [],
            availableDays: rec.availability?.days || ['Monday', 'Wednesday', 'Friday'],
            timeSlots: rec.availability?.timeSlots || ['09:00 - 11:00 AM', '02:00 - 04:00 PM']
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleDayToggle = (day) => {
    setProfileData((prev) => {
      const exists = prev.availableDays.includes(day);
      if (exists) {
        return { ...prev, availableDays: prev.availableDays.filter((d) => d !== day) };
      } else {
        return { ...prev, availableDays: [...prev.availableDays, day] };
      }
    });
  };

  const handleCategoryToggle = (cat) => {
    setProfileData((prev) => {
      const exists = prev.supportedCategories.includes(cat);
      if (exists) {
        return { ...prev, supportedCategories: prev.supportedCategories.filter((c) => c !== cat) };
      } else {
        return { ...prev, supportedCategories: [...prev.supportedCategories, cat] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSavedSuccess(false);
    setSaving(true);

    try {
      const serviceAreas = profileData.serviceAreasInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await recyclerService.updateAvailability(recycler._id, {
        serviceAreas,
        supportedCategories: profileData.supportedCategories,
        description: profileData.description,
        address: profileData.address,
        days: profileData.availableDays,
        timeSlots: profileData.timeSlots
      });

      await refreshUser();
      setSavedSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update recycler profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <LoadingSpinner text="Loading your recycler operational profile..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem', maxWidth: '840px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/recycler-dashboard" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Recycler Facility Profile & Availability
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Configure operational coverage, supported e-waste streams, and active collection time slots.
        </p>
      </div>

      {savedSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle2 size={18} />
          <span>Profile and availability settings updated successfully in MongoDB!</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            Operating Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Organization Name</label>
              <input
                type="text"
                className="form-control"
                value={profileData.organizationName}
                disabled
                style={{ background: 'var(--bg-main)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Contact Person</label>
              <input
                type="text"
                className="form-control"
                value={profileData.contactPerson}
                disabled
                style={{ background: 'var(--bg-main)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Official Address</label>
            <input
              type="text"
              className="form-control"
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Service Areas (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={profileData.serviceAreasInput}
              onChange={(e) => setProfileData({ ...profileData, serviceAreasInput: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Facility Mission & Description</label>
            <textarea
              className="form-control"
              rows={2}
              value={profileData.description}
              onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
            />
          </div>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginTop: '0.5rem' }}>
            Accepted Categories
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {allCategories.map((cat) => (
              <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                <input
                  type="checkbox"
                  checked={profileData.supportedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginTop: '0.5rem' }}>
            Available Pickup Days
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {daysOfWeek.map((day) => {
              const isSelected = profileData.availableDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: isSelected ? 'var(--primary)' : '#ffffff',
                    color: isSelected ? '#ffffff' : 'var(--text-main)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={saving}
          >
            <Save size={18} />
            {saving ? 'Updating Database...' : 'Save Availability & Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecyclerProfilePage;
