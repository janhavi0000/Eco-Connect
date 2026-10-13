import React, { useState, useEffect } from 'react';
import { pickupSpotService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import MapPicker from '../components/MapPicker';
import { MapPin, Plus, Trash2, Edit, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecyclerPickupSpotsPage = () => {
  const { recycler } = useAuth();
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpotId, setEditingSpotId] = useState(null);
  const [spotData, setSpotData] = useState({
    name: '',
    address: 'Student Center Plaza, University Campus',
    latitude: 28.6150,
    longitude: 77.2100,
    availableDatesInput: '2026-10-15, 2026-10-16, 2026-10-17, 2026-10-20',
    availableTimeSlots: [
      '09:00 - 11:00 AM',
      '11:00 - 01:00 PM',
      '02:00 - 04:00 PM',
      '04:00 - 06:00 PM'
    ],
    slotCapacity: 5,
    instructions: 'Look for the branded green EcoConnect collection container.'
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchSpots = async () => {
    setLoading(true);
    try {
      if (recycler) {
        const res = await pickupSpotService.getAll({ recyclerId: recycler._id, activeOnly: 'false' });
        if (res.data?.success) {
          setSpots(res.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to load pickup spots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, [recycler]);

  const handleOpenCreateModal = () => {
    setEditingSpotId(null);
    setSpotData({
      name: '',
      address: 'Community Center Drop-off Kiosk',
      latitude: 28.6150,
      longitude: 77.2100,
      availableDatesInput: '2026-10-15, 2026-10-16, 2026-10-18',
      availableTimeSlots: [
        '09:00 - 11:00 AM',
        '11:00 - 01:00 PM',
        '02:00 - 04:00 PM',
        '04:00 - 06:00 PM'
      ],
      slotCapacity: 5,
      instructions: 'Drop off near the designated green EcoConnect kiosk.'
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (spot) => {
    setEditingSpotId(spot._id);
    setSpotData({
      name: spot.name,
      address: spot.address,
      latitude: spot.latitude,
      longitude: spot.longitude,
      availableDatesInput: spot.availableDates.join(', '),
      availableTimeSlots: spot.availableTimeSlots,
      slotCapacity: spot.slotCapacity,
      instructions: spot.instructions
    });
    setModalOpen(true);
  };

  const handleSaveSpot = async (e) => {
    e.preventDefault();
    setError('');

    if (!spotData.name || !spotData.address) {
      setError('Spot name and address are required.');
      return;
    }

    setSaving(true);
    try {
      const availableDates = spotData.availableDatesInput
        .split(',')
        .map((d) => d.trim())
        .filter((d) => d.length > 0);

      const payload = {
        name: spotData.name,
        address: spotData.address,
        latitude: spotData.latitude,
        longitude: spotData.longitude,
        availableDates,
        availableTimeSlots: spotData.availableTimeSlots,
        slotCapacity: Number(spotData.slotCapacity) || 5,
        instructions: spotData.instructions
      };

      if (editingSpotId) {
        await pickupSpotService.update(editingSpotId, payload);
      } else {
        await pickupSpotService.create(payload);
      }

      setModalOpen(false);
      fetchSpots();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save pickup spot.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSpot = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pickup spot?')) return;
    try {
      await pickupSpotService.delete(id);
      fetchSpots();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete pickup spot.');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem', maxWidth: '960px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Manage Community Pickup Spots
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Configure neighborhood drop-off locations, dates, and maximum capacities per time slot.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/recycler-dashboard" className="btn btn-outline btn-sm">
            Back to Requests
          </Link>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} /> Add New Pickup Spot
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your pickup spots from MongoDB..." />
      ) : spots.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {spots.map((spot) => (
            <div key={spot._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {spot.name}
                  </h3>
                  <span className={`badge ${spot.isActive ? 'badge-collected' : 'badge-cancelled'}`}>
                    {spot.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <MapPin size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{spot.address}</span>
                </div>

                <div style={{ background: 'var(--bg-main)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <Calendar size={13} color="var(--primary)" />
                    <strong>Available Dates:</strong> {spot.availableDates.join(', ') || 'Any scheduled day'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <Clock size={13} color="var(--secondary)" />
                    <strong>Slots:</strong> {spot.availableTimeSlots.slice(0, 2).join(' | ')}
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>
                    Capacity per slot: <strong>{spot.slotCapacity} requests max</strong>
                  </div>
                </div>

                {spot.instructions && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>
                    "{spot.instructions}"
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(spot)}
                  className="btn btn-outline btn-sm"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSpot(spot._id)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MapPin}
          title="No pickup spots configured"
          description="Create designated campus kiosks or drop-off centers so community members can bring their e-waste directly."
          actionText="Create First Pickup Spot"
          onAction={handleOpenCreateModal}
        />
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSpotId ? 'Edit Pickup Spot' : 'Create New Pickup Spot'}
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveSpot}
              className="btn btn-primary btn-sm"
              disabled={saving}
            >
              {saving ? 'Saving Spot...' : 'Save Pickup Spot'}
            </button>
          </>
        }
      >
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSaveSpot} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Spot Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Campus Student Union Kiosk"
              value={spotData.name}
              onChange={(e) => setSpotData({ ...spotData, name: e.target.value })}
              required
            />
          </div>

          <MapPicker
            location={{
              address: spotData.address,
              latitude: spotData.latitude,
              longitude: spotData.longitude
            }}
            onChange={(loc) =>
              setSpotData({
                ...spotData,
                address: loc.address,
                latitude: loc.latitude,
                longitude: loc.longitude
              })
            }
            label="Spot Address & Coordinates"
          />

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Available Dates (YYYY-MM-DD, comma-separated)</label>
            <input
              type="text"
              className="form-control"
              placeholder="2026-10-15, 2026-10-16, 2026-10-18"
              value={spotData.availableDatesInput}
              onChange={(e) => setSpotData({ ...spotData, availableDatesInput: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Max Booking Capacity Per Time Slot</label>
            <input
              type="number"
              min={1}
              max={50}
              className="form-control"
              value={spotData.slotCapacity}
              onChange={(e) => setSpotData({ ...spotData, slotCapacity: e.target.value })}
            />
            <div className="form-help">
              Prevents duplicate/over-booking once this number of requests is booked for any slot.
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Drop-off Instructions for Residents</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Deposit in green bin next to security counter."
              value={spotData.instructions}
              onChange={(e) => setSpotData({ ...spotData, instructions: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecyclerPickupSpotsPage;
