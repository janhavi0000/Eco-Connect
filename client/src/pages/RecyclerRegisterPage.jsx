import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

const RecyclerRegisterPage = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    serviceAreasInput: 'Campus Area, Downtown Hub, Greenfield Suburb',
    description: 'Certified e-waste collection and recovery partner.',
    supportedCategories: [
      'Mobile Phones',
      'Chargers / Cables',
      'Batteries',
      'Laptops / Computers',
      'Keyboards',
      'Earphones / Headphones'
    ],
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    availableTimeSlots: [
      '09:00 - 11:00 AM',
      '11:00 - 01:00 PM',
      '02:00 - 04:00 PM',
      '04:00 - 06:00 PM'
    ]
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registeredPending, setRegisteredPending] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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

  const handleCategoryToggle = (cat) => {
    setFormData((prev) => {
      const exists = prev.supportedCategories.includes(cat);
      if (exists) {
        return { ...prev, supportedCategories: prev.supportedCategories.filter((c) => c !== cat) };
      } else {
        return { ...prev, supportedCategories: [...prev.supportedCategories, cat] };
      }
    });
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const exists = prev.availableDays.includes(day);
      if (exists) {
        return { ...prev, availableDays: prev.availableDays.filter((d) => d !== day) };
      } else {
        return { ...prev, availableDays: [...prev.availableDays, day] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.supportedCategories.length === 0) {
      setError('Please select at least one accepted e-waste category.');
      return;
    }

    if (formData.availableDays.length === 0) {
      setError('Please select at least one operational day.');
      return;
    }

    setSubmitting(true);
    try {
      const serviceAreas = formData.serviceAreasInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await register({
        name: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'recycler',
        organizationName: formData.organizationName,
        address: formData.address,
        serviceAreas,
        supportedCategories: formData.supportedCategories,
        description: formData.description,
        availability: {
          days: formData.availableDays,
          timeSlots: formData.availableTimeSlots
        }
      });

      setRegisteredPending(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Recycler registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (registeredPending) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '600px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ width: '64px', height: '64px', background: '#fef3c7', color: '#d97706', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <ShieldCheck size={36} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Application Submitted: Status PENDING
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your recycler partner application for <strong>{formData.organizationName}</strong> has been received with status <code>PENDING</code>. An administrator will verify your operating credentials before your center appears as an officially available collection option.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/recycler-dashboard')}
              className="btn btn-primary"
            >
              Go to Recycler Dashboard
            </button>
            <Link to="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 4rem 1.5rem', maxWidth: '750px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--secondary-light)', color: 'var(--secondary)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <Truck size={14} />
          <span>Recycling Facility & Collector Onboarding</span>
        </div>
        <h1 className="section-title">Join as an Authorized Recycler Partner</h1>
        <p className="section-subtitle">
          Register your organization to collect e-waste from community members, set pickup kiosks, and manage scheduled collection slots.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            1. Organization & Contact Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Organization / Facility Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. GreenCycle E-Waste Hub"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Primary Contact Person <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Sarah Jenkins"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Official Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="collector@example.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                className="form-control"
                placeholder="+1-555-0200"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              Facility Address <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 104 Eco Tech Park, Sector 4"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              Service Areas (comma-separated) <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Campus North, Downtown, East Residential District"
              value={formData.serviceAreasInput}
              onChange={(e) => setFormData({ ...formData, serviceAreasInput: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              Facility Description & Environmental Mission
            </label>
            <textarea
              className="form-control"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginTop: '1rem' }}>
            2. Accepted Categories & Operating Schedule
          </h3>

          <div>
            <label className="form-label">
              Supported E-Waste Categories <span className="required">*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.4rem' }}>
              {allCategories.map((cat) => (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.supportedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">
              Operational Pickup Days <span className="required">*</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
              {daysOfWeek.map((day) => {
                const isSelected = formData.availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: isSelected ? 'var(--primary)' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginTop: '1rem' }}>
            3. Account Security Credentials
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="alert alert-info" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            <ShieldCheck size={20} />
            <span style={{ fontSize: '0.86rem' }}>
              Note: Upon submission, your recycler account will be marked with <strong>status = PENDING</strong>. You can configure pickup spots immediately, and your profile will be publicly discoverable once approved by the community admin.
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={submitting}
          >
            <Truck size={18} />
            {submitting ? 'Registering Recycler...' : 'Submit Recycler Application'}
          </button>
        </div>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Already registered?{' '}
        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
          Sign In to Recycler Hub
        </Link>
      </div>
    </div>
  );
};

export default RecyclerRegisterPage;
