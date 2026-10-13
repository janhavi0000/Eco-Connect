import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  Plus,
  Clock,
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  ChevronRight,
  Truck,
  Recycle
} from 'lucide-react';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await requestService.getMyRequests();
        if (res.data?.success) {
          setRequests(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load user requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRequests();
  }, []);

  const activeRequests = requests.filter(
    (r) => ['PENDING', 'ACCEPTED', 'SCHEDULED'].includes(r.status)
  ).length;

  const completedCollections = requests.filter(
    (r) => r.status === 'COLLECTED'
  ).length;

  const totalItemsSubmitted = requests.reduce(
    (sum, r) => sum + (r.totalQuantity || 0),
    0
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'badge-pending';
      case 'ACCEPTED': return 'badge-accepted';
      case 'SCHEDULED': return 'badge-scheduled';
      case 'COLLECTED': return 'badge-collected';
      case 'REJECTED': return 'badge-rejected';
      case 'CANCELLED': return 'badge-cancelled';
      default: return 'badge-pending';
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Community Resident Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Welcome back, {user?.name}! Track your household e-waste collections below.
          </p>
        </div>
        <Link to="/submit-ewaste" className="btn btn-primary">
          <Plus size={18} /> Schedule New E-Waste Pickup
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="dashboard-grid">
        <StatsCard
          icon={Clock}
          title="Active Requests"
          value={activeRequests}
          color="amber"
          subtitle="In pipeline or scheduled"
        />
        <StatsCard
          icon={CheckCircle2}
          title="Completed Collections"
          value={completedCollections}
          color="green"
          subtitle="Certified recycled"
        />
        <StatsCard
          icon={Package}
          title="Total Items Submitted"
          value={totalItemsSubmitted}
          color="teal"
          subtitle="Electronics diverted from landfill"
        />
      </div>

      {/* My Requests Section */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div className="card-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              My Collection Requests
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Live lifecycle status tracked directly in MongoDB
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total: {requests.length} requests
          </span>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching your requests..." />
        ) : requests.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Submitted Date</th>
                  <th>E-Waste Items</th>
                  <th>Recycler Partner</th>
                  <th>Pickup Option</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.85rem' }}>
                        #{req._id.substring(req._id.length - 6).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <Calendar size={13} />
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {req.items[0]?.itemType || req.items[0]?.category}
                          {req.items.length > 1 && ` (+${req.items.length - 1} more)`}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Qty: {req.totalQuantity} items
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
                        <Truck size={14} color="var(--primary)" />
                        <span>{req.recyclerId?.organizationName || 'Assigned Recycler'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div>{req.pickupMethod}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {req.preferredDate} ({req.preferredTime})
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/request/${req._id}`}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
                      >
                        Details <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Recycle}
            title="No collection requests yet"
            description="Start by registering your unwanted electronic devices for convenient pickup or kiosk deposit."
            actionText="Schedule Your First Pickup"
            actionLink="/submit-ewaste"
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
