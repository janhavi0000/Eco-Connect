import React, { useState, useEffect } from 'react';
import { adminService, recyclerService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';
import {
  Archive,
  Search,
  Filter,
  Calendar,
  Truck,
  MapPin,
  PackageCheck,
  ArrowLeft,
  Download
} from 'lucide-react';

const AdminRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [recyclerId, setRecyclerId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const categories = [
    'All Categories',
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

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category && category !== 'All Categories') params.category = category;
      if (recyclerId) params.recyclerId = recyclerId;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const [recordsRes, recyclersRes] = await Promise.all([
        adminService.getRecords(params),
        recyclerService.getAll()
      ]);

      if (recordsRes.data?.success) setRecords(recordsRes.data.data);
      if (recyclersRes.data?.success) setRecyclers(recyclersRes.data.data);
    } catch (err) {
      console.error('Failed to load collection records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [category, recyclerId, dateFrom, dateTo]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecords();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setRecyclerId('');
    setDateFrom('');
    setDateTo('');
    fetchRecords();
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin-dashboard" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={15} /> Back to Admin Overview
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Permanent E-Waste Collection Archive
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Permanent digital records generated automatically upon verified collector handoff
          </p>
        </div>

        <span className="badge badge-collected" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
          {records.length} Certified Records
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 220px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search user, recycler, address..."
              style={{ paddingLeft: '2.2rem', fontSize: '0.88rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '180px' }}>
            <select
              className="form-control"
              style={{ fontSize: '0.88rem' }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ width: '180px' }}>
            <select
              className="form-control"
              style={{ fontSize: '0.88rem' }}
              value={recyclerId}
              onChange={(e) => setRecyclerId(e.target.value)}
            >
              <option value="">All Recyclers</option>
              {recyclers.map((r) => (
                <option key={r._id} value={r._id}>{r.organizationName}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <input
              type="date"
              className="form-control"
              style={{ fontSize: '0.85rem', width: '135px' }}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              title="From date"
            />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>to</span>
            <input
              type="date"
              className="form-control"
              style={{ fontSize: '0.85rem', width: '135px' }}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              title="To date"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            Filter
          </button>
          <button type="button" onClick={handleResetFilters} className="btn btn-outline btn-sm">
            Reset
          </button>
        </form>
      </div>

      {/* Records Table */}
      <div className="card" style={{ padding: '1.75rem' }}>
        {loading ? (
          <LoadingSpinner text="Querying collection archives in MongoDB..." />
        ) : records.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Record / Request</th>
                  <th>Resident</th>
                  <th>Recycler Facility</th>
                  <th>Primary Category</th>
                  <th>Items & Details</th>
                  <th>Total Qty</th>
                  <th>Location</th>
                  <th>Collection Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec._id}>
                    <td>
                      <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.85rem' }}>
                        #{rec._id.substring(rec._id.length - 6).toUpperCase()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Req: #{rec.requestId?.toString().substring(rec.requestId.toString().length - 6).toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rec.userName || 'Community User'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
                        <Truck size={14} color="var(--primary)" />
                        <span>{rec.recyclerName}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600 }}>
                        {rec.primaryCategory}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', maxWidth: '200px' }}>
                        {rec.items?.map((it, i) => (
                          <div key={i}>
                            {it.itemType || it.category} ({it.quantity})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <strong>{rec.totalQuantity} items</strong>
                      {rec.totalWeight > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rec.totalWeight} kg</div>}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rec.pickupLocation?.address}>
                        {rec.pickupLocation?.address}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {new Date(rec.collectionDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-collected">
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Archive}
            title="No permanent collection records found"
            description="Completed collections marked by authorized recyclers will automatically populate this permanent archive."
            actionText="Clear Filter Settings"
            onAction={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
};

export default AdminRecordsPage;
