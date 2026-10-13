import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recyclerService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import {
  Truck,
  Clock,
  Calendar,
  CheckCircle2,
  PackageCheck,
  AlertCircle,
  Eye,
  Check,
  X,
  MapPin,
  CalendarDays,
  Plus
} from 'lucide-react';

const RecyclerDashboardPage = () => {
  const { user, recycler } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  // Schedule Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [targetRequestId, setTargetRequestId] = useState(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:00 - 12:00 PM');
  const [scheduleNote, setScheduleNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Outside current service coverage');

  const fetchRecyclerRequests = async () => {
    setLoading(true);
    try {
      const res = await recyclerService.getRecyclerRequests();
      if (res.data?.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load recycler requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecyclerRequests();
  }, []);

  const handleStatusUpdate = async (reqId, newStatus, extraData = {}) => {
    setActionLoading(true);
    try {
      const res = await recyclerService.updateRequestStatus(reqId, {
        status: newStatus,
        ...extraData
      });
      if (res.data?.success) {
        // Refresh list
        fetchRecyclerRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request status.');
    } finally {
      setActionLoading(false);
      setScheduleModalOpen(false);
      setRejectModalOpen(false);
    }
  };

  // Metrics
  const newRequests = requests.filter((r) => r.status === 'PENDING').length;
  const acceptedRequests = requests.filter((r) => r.status === 'ACCEPTED').length;
  const scheduledPickups = requests.filter((r) => r.status === 'SCHEDULED').length;
  const completedCollections = requests.filter((r) => r.status === 'COLLECTED').length;
  const totalCollectedQuantity = requests
    .filter((r) => r.status === 'COLLECTED')
    .reduce((sum, r) => sum + (r.totalQuantity || 0), 0);

  // Filter requests by tab
  const filteredRequests =
    activeTab === 'ALL'
      ? requests
      : requests.filter((r) => r.status === activeTab);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
      {/* Header & Verification Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Recycler Operations Portal
            </h1>
            {recycler?.verificationStatus === 'VERIFIED' ? (
              <span className="badge badge-verified">
                <CheckCircle2 size={13} /> Verified Partner
              </span>
            ) : (
              <span className="badge badge-pending">
                {recycler?.verificationStatus || 'PENDING APPROVAL'}
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Organization: <strong>{recycler?.organizationName || 'Recycler Facility'}</strong> · Manage incoming requests and schedule pickups
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/recycler-pickup-spots" className="btn btn-outline btn-sm">
            <MapPin size={16} /> Manage Pickup Spots
          </Link>
          <Link to="/recycler-profile" className="btn btn-outline-primary btn-sm">
            <CalendarDays size={16} /> Availability Settings
          </Link>
        </div>
      </div>

      {recycler?.verificationStatus === 'PENDING' && (
        <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
          <AlertCircle size={20} />
          <span>
            <strong>Account Pending Admin Verification:</strong> Your registration has been submitted. While an administrator reviews your credentials, you can configure your pickup spots and availability below.
          </span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="dashboard-grid">
        <StatsCard
          icon={Clock}
          title="New Requests"
          value={newRequests}
          color="amber"
          subtitle="Awaiting acceptance"
        />
        <StatsCard
          icon={CheckCircle2}
          title="Accepted Requests"
          value={acceptedRequests}
          color="blue"
          subtitle="Ready to schedule"
        />
        <StatsCard
          icon={Calendar}
          title="Scheduled Pickups"
          value={scheduledPickups}
          color="purple"
          subtitle="Upcoming collection drives"
        />
        <StatsCard
          icon={PackageCheck}
          title="Completed Collections"
          value={completedCollections}
          color="green"
          subtitle={`${totalCollectedQuantity} total items recycled`}
        />
      </div>

      {/* Requests Management Table */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Incoming Collection Orders</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Real-time synchronization with community user submissions
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['ALL', 'PENDING', 'ACCEPTED', 'SCHEDULED', 'COLLECTED'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.78rem' }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading assigned requests from MongoDB..." />
        ) : filteredRequests.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Resident</th>
                  <th>E-Waste Items</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Preferred Slot</th>
                  <th>Status</th>
                  <th>Recycler Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req._id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.85rem' }}>
                        #{req._id.substring(req._id.length - 6).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {req.userId?.name || 'Community Member'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {req.userId?.phone || ''}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.88rem' }}>
                        {req.items.map((it, i) => (
                          <div key={i} style={{ whiteSpace: 'nowrap' }}>
                            {it.category} ({it.itemType}) × {it.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                        {req.totalQuantity} items
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', maxWidth: '180px' }}>
                        <div style={{ fontWeight: 600 }}>{req.pickupMethod}</div>
                        <div style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={req.pickupLocation?.address}>
                          {req.pickupLocation?.address}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>
                        <div>{req.preferredDate}</div>
                        <div style={{ color: 'var(--text-muted)' }}>{req.preferredTime}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${req.status.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Link
                          to={`/request/${req._id}`}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.55rem' }}
                          title="View Full Details"
                        >
                          <Eye size={14} />
                        </Link>

                        {/* PENDING -> Accept / Reject */}
                        {req.status === 'PENDING' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(req._id, 'ACCEPTED')}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.35rem 0.65rem' }}
                              disabled={actionLoading}
                            >
                              <Check size={14} /> Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTargetRequestId(req._id);
                                setRejectModalOpen(true);
                              }}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.35rem 0.55rem' }}
                              disabled={actionLoading}
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}

                        {/* ACCEPTED -> Schedule */}
                        {req.status === 'ACCEPTED' && (
                          <button
                            type="button"
                            onClick={() => {
                              setTargetRequestId(req._id);
                              setScheduledDate(req.preferredDate);
                              setScheduledTime(req.preferredTime);
                              setScheduleModalOpen(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.65rem' }}
                            disabled={actionLoading}
                          >
                            <Calendar size={14} /> Schedule
                          </button>
                        )}

                        {/* SCHEDULED -> Mark as Collected */}
                        {req.status === 'SCHEDULED' && (
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(req._id, 'COLLECTED', { note: 'Items verified and safely loaded for processing.' })}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.35rem 0.65rem', background: 'var(--success)' }}
                            disabled={actionLoading}
                          >
                            <PackageCheck size={14} /> Mark Collected
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Truck}
            title="No collection requests in this view"
            description="Requests assigned to your facility will appear here as residents register e-waste."
          />
        )}
      </div>

      {/* SCHEDULE MODAL */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Confirm Scheduled Pickup Appointment"
        footer={
          <>
            <button
              type="button"
              onClick={() => setScheduleModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() =>
                handleStatusUpdate(targetRequestId, 'SCHEDULED', {
                  scheduledDate,
                  scheduledTime,
                  note: scheduleNote || `Pickup confirmed for ${scheduledDate} (${scheduledTime})`
                })
              }
              className="btn btn-primary btn-sm"
              disabled={actionLoading}
            >
              {actionLoading ? 'Saving...' : 'Confirm & Schedule'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Confirmed Pickup Date</label>
            <input
              type="date"
              className="form-control"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Confirmed Time Slot</label>
            <select
              className="form-control"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            >
              <option value="09:00 - 11:00 AM">09:00 - 11:00 AM</option>
              <option value="11:00 - 01:00 PM">11:00 - 01:00 PM</option>
              <option value="02:00 - 04:00 PM">02:00 - 04:00 PM</option>
              <option value="04:00 - 06:00 PM">04:00 - 06:00 PM</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Note for Community Member</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Van #3 assigned; driver will ring upon parking."
              value={scheduleNote}
              onChange={(e) => setScheduleNote(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* REJECT MODAL */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Decline Collection Request"
        footer={
          <>
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() =>
                handleStatusUpdate(targetRequestId, 'REJECTED', {
                  note: rejectReason
                })
              }
              className="btn btn-danger btn-sm"
              disabled={actionLoading}
            >
              Confirm Decline
            </button>
          </>
        }
      >
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Reason for declining this request:</label>
          <input
            type="text"
            className="form-control"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default RecyclerDashboardPage;
