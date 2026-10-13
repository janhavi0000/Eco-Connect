import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { Link } from 'react-router-dom';
import {
  Users,
  Truck,
  ClipboardList,
  Recycle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  BarChart3,
  Archive,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

const COLORS = ['#059669', '#0d9488', '#0284c7', '#6366f1', '#8b5cf6', '#d97706', '#dc2626', '#64748b'];

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [pendingRecyclers, setPendingRecyclers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verification Modal State
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedRecyclerId, setSelectedRecyclerId] = useState(null);
  const [verificationAction, setVerificationAction] = useState('VERIFIED');
  const [verificationReason, setVerificationReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes, recyclersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAnalytics(),
        adminService.getRecyclers({ status: 'PENDING' })
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.data);
      if (analyticsRes.data?.success) setAnalytics(analyticsRes.data.data);
      if (recyclersRes.data?.success) setPendingRecyclers(recyclersRes.data.data);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifySubmit = async () => {
    setActionLoading(true);
    try {
      await adminService.verifyRecycler(selectedRecyclerId, {
        status: verificationAction,
        reason: verificationReason
      });
      setVerifyModalOpen(false);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Verification update failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            EcoConnect Administration & CEP Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            System-wide operational oversight, recycler verification approvals, and permanent collection records
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/records" className="btn btn-outline btn-sm">
            <Archive size={15} /> Collection Records Archive
          </Link>
          <Link to="/admin/survey" className="btn btn-outline-primary btn-sm">
            <BarChart3 size={15} /> Survey Analytics
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Computing MongoDB aggregation analytics..." />
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="dashboard-grid">
            <StatsCard
              icon={Users}
              title="Community Users"
              value={stats?.totalUsers || 0}
              color="blue"
              subtitle="Registered household accounts"
            />
            <StatsCard
              icon={Truck}
              title="Active Recyclers"
              value={stats?.verifiedRecyclers || 0}
              color="teal"
              subtitle={`${stats?.pendingRecyclers || 0} pending verification`}
            />
            <StatsCard
              icon={ClipboardList}
              title="Total Requests"
              value={stats?.totalRequests || 0}
              color="purple"
              subtitle={`${stats?.pendingRequests || 0} pending pickup`}
            />
            <StatsCard
              icon={Recycle}
              title="E-Waste Recycled"
              value={`${stats?.totalQuantityCollected || 0} Items`}
              color="green"
              subtitle={stats?.totalWeightCollected ? `Approx. ${stats.totalWeightCollected} kg diverted` : 'Zero-landfill certified'}
            />
          </div>

          {/* Pending Recycler Approvals Section */}
          <div className="card" style={{ marginBottom: '2.5rem', padding: '1.75rem' }}>
            <div className="card-header" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} color="var(--primary)" />
                  Recycler Verification Queue ({pendingRecyclers.length})
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Approve or decline partner facilities to make them available for neighborhood selection
                </p>
              </div>
            </div>

            {pendingRecyclers.length > 0 ? (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Facility Name</th>
                      <th>Representative</th>
                      <th>Contact Email / Phone</th>
                      <th>Service Areas</th>
                      <th>Address</th>
                      <th>Review & Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRecyclers.map((rec) => (
                      <tr key={rec._id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            {rec.organizationName}
                          </div>
                          <span className="badge badge-pending">PENDING</span>
                        </td>
                        <td>{rec.contactPerson}</td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>{rec.email}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rec.phone}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem', maxWidth: '180px' }}>
                            {rec.serviceAreas?.join(', ') || 'Campus Area'}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.82rem', maxWidth: '200px' }}>{rec.address}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRecyclerId(rec._id);
                                setVerificationAction('VERIFIED');
                                setVerifyModalOpen(true);
                              }}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.35rem 0.75rem' }}
                            >
                              <CheckCircle2 size={14} /> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRecyclerId(rec._id);
                                setVerificationAction('REJECTED');
                                setVerifyModalOpen(true);
                              }}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.35rem 0.75rem' }}
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                <CheckCircle2 size={24} color="var(--primary)" style={{ margin: '0 auto 0.5rem auto' }} />
                All recycler registrations are currently verified. No pending reviews in queue.
              </div>
            )}
          </div>

          {/* Real MongoDB Analytics Charts (Recharts) */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              Real-Time Collection Analytics
            </h2>

            {analytics && (analytics.categoryDistribution.length > 0 || analytics.statusBreakdown.length > 0) ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
                {/* 1. Category Distribution Bar Chart */}
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>E-Waste Categories Collected</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Total quantity of registered items grouped by category
                  </p>
                  <div style={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer>
                      <BarChart data={analytics.categoryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="category" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="quantity" fill="#059669" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Requests by Status Pie Chart */}
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Request Status Breakdown</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Current lifecycle state of all community submissions
                  </p>
                  <div style={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={analytics.statusBreakdown}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analytics.statusBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Collection Trends Over Time */}
                {analytics.collectionTrends.length > 0 && (
                  <div className="card" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Community Submission Trend Over Time</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      Daily request volume and completed item collections
                    </p>
                    <div style={{ width: '100%', height: 260 }}>
                      <ResponsiveContainer>
                        <LineChart data={analytics.collectionTrends} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="requests" stroke="#0284c7" strokeWidth={2} name="Total Requests" />
                          <Line type="monotone" dataKey="collectedItems" stroke="#059669" strokeWidth={2} name="Collected Items" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <BarChart3 size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                <h3>No collection data available yet</h3>
                <p>Charts will dynamically display analytics as residents submit requests and recyclers complete pickups.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* VERIFICATION MODAL */}
      <Modal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title={verificationAction === 'VERIFIED' ? 'Approve Recycler Partner' : 'Decline Recycler Partner'}
        footer={
          <>
            <button
              type="button"
              onClick={() => setVerifyModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleVerifySubmit}
              className={`btn btn-sm ${verificationAction === 'VERIFIED' ? 'btn-primary' : 'btn-danger'}`}
              disabled={actionLoading}
            >
              {actionLoading ? 'Updating...' : `Confirm ${verificationAction === 'VERIFIED' ? 'Approval' : 'Rejection'}`}
            </button>
          </>
        }
      >
        <p style={{ fontSize: '0.92rem', marginBottom: '1rem' }}>
          {verificationAction === 'VERIFIED'
            ? 'Approving this recycler will grant them official verified partner status and list their services publicly on the Find Recycler matching page.'
            : 'Rejecting this registration will prevent the facility from appearing in public directories.'}
        </p>

        {verificationAction === 'REJECTED' && (
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Reason for Rejection</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Incomplete facility credentials"
              value={verificationReason}
              onChange={(e) => setVerificationReason(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
