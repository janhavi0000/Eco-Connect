import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { requestService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusTimeline from '../components/StatusTimeline';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import MapPicker from '../components/MapPicker';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Truck,
  Building2,
  Package,
  Layers,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';

const RequestDetailsPage = () => {
  const { id } = useParams();
  const locationState = useLocation().state;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cancel Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of schedule / items already gifted');
  const [cancelling, setCancelling] = useState(false);

  const fetchRequestDetails = async () => {
    setLoading(true);
    try {
      const res = await requestService.getById(id);
      if (res.data?.success) {
        setRequest(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve request details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const handleCancelRequest = async () => {
    setCancelling(true);
    try {
      const res = await requestService.cancel(id, cancelReason);
      if (res.data?.success) {
        setRequest(res.data.data);
        setShowCancelModal(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel request.');
    } finally {
      setCancelling(false);
    }
  };

  const canCancel =
    request &&
    ['PENDING', 'ACCEPTED'].includes(request.status) &&
    (user?.role === 'user' || user?.role === 'admin');

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <LoadingSpinner text="Retrieving request timeline & records from MongoDB..." />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '600px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <AlertCircle size={36} color="var(--danger)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>Error Loading Request</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || 'Request not found'}</p>
          <Link to="/dashboard" className="btn btn-outline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem', maxWidth: '960px' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to={
            user?.role === 'recycler'
              ? '/recycler-dashboard'
              : user?.role === 'admin'
              ? '/admin-dashboard'
              : '/dashboard'
          }
          className="btn btn-outline btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>
      </div>

      {locationState?.newRequestSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle2 size={18} />
          <span>
            <strong>Request Registered Successfully!</strong> Your request has been logged in MongoDB and assigned to your chosen recycler partner.
          </span>
        </div>
      )}

      {/* Header Info */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Request #{request._id.substring(request._id.length - 8).toUpperCase()}
              </h1>
              <span className={`badge badge-${request.status.toLowerCase()}`}>
                {request.status}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Created: {new Date(request.createdAt).toLocaleString()} · Last Updated: {new Date(request.updatedAt).toLocaleString()}
            </p>
          </div>

          {canCancel && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="btn btn-danger btn-sm"
            >
              <XCircle size={15} /> Cancel Request
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Details & Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* E-Waste Items Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <Package size={18} color="var(--primary)" />
              Registered Items ({request.totalQuantity} Total Units)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {request.items.map((it, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-main)',
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      {it.itemType}
                    </span>
                    <span style={{ fontSize: '0.8rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                      Qty: {it.quantity}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>Category: <strong>{it.category}</strong></span>
                    <span>Condition: <strong>{it.condition}</strong></span>
                    {it.weight > 0 && <span>Weight: <strong>{it.weight} kg</strong></span>}
                  </div>
                  {it.description && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                      "{it.description}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1rem', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Disposal Preference: <strong>{request.preferredDisposalMethod}</strong>
            </div>
          </div>

          {/* Assigned Recycler Partner Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <Truck size={18} color="var(--primary)" />
              Assigned Recycler Partner
            </h3>

            {request.recyclerId ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  {request.recyclerId.organizationName}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  Contact Representative: {request.recyclerId.contactPerson}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  Phone: {request.recyclerId.phone}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  Email: {request.recyclerId.email}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                  Address: {request.recyclerId.address}
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Recycler partner awaiting assignment.
              </p>
            )}
          </div>

          {/* Location & Appointment Details */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <MapPin size={18} color="var(--primary)" />
              Collection Appointment & Location
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', marginBottom: '1rem' }}>
              <div>
                <strong>Method:</strong> {request.pickupMethod}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} color="var(--primary)" />
                <span>Date: <strong>{request.preferredDate}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} color="var(--secondary)" />
                <span>Time Slot: <strong>{request.preferredTime}</strong></span>
              </div>
              <div>
                <strong>Address:</strong> {request.pickupLocation?.address}
              </div>
            </div>

            {/* Readonly map view */}
            {request.pickupLocation && (
              <MapPicker
                location={request.pickupLocation}
                onChange={() => {}}
                readOnly={true}
                label="Coordinates on OpenStreetMap"
              />
            )}
          </div>
        </div>

        {/* Right Column: Status Tracking Timeline */}
        <div>
          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
              Collection Lifecycle Tracking
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Real-time progression persisted with timestamps in the database
            </p>

            <StatusTimeline
              currentStatus={request.status}
              statusHistory={request.statusHistory}
            />

            {request.status === 'COLLECTED' && (
              <div style={{ marginTop: '1.5rem', background: 'var(--success-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', color: '#166534', fontSize: '0.88rem' }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <CheckCircle2 size={16} /> Certified Collection Completed
                </div>
                <span>
                  Permanent collection record has been saved. Thank you for contributing to responsible community recycling!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Request Cancellation */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel E-Waste Collection Request"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              className="btn btn-outline btn-sm"
              disabled={cancelling}
            >
              Keep Request
            </button>
            <button
              type="button"
              onClick={handleCancelRequest}
              className="btn btn-danger btn-sm"
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', marginBottom: '1rem' }}>
          Are you sure you want to cancel this request? Any reserved pickup spot time slot will be released back to other community members.
        </p>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            Reason for Cancellation:
          </label>
          <input
            type="text"
            className="form-control"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default RequestDetailsPage;
