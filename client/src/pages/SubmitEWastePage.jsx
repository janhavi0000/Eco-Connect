import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { requestService, recyclerService, pickupSpotService } from '../services/api';
import MapPicker from '../components/MapPicker';
import RecyclerCard from '../components/RecyclerCard';
import {
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  Layers,
  Send
} from 'lucide-react';

const SubmitEWastePage = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state;

  // Form State
  const [items, setItems] = useState([
    {
      category: 'Mobile Phones',
      itemType: '',
      quantity: 1,
      weight: 0,
      condition: 'Dead / Damaged',
      description: ''
    }
  ]);

  const [pickupMethod, setPickupMethod] = useState('Doorstep Pickup');
  const [preferredDisposalMethod, setPreferredDisposalMethod] = useState('Eco Recycling');
  const [location, setLocation] = useState({
    address: 'Campus Plaza, Student Center',
    latitude: 28.6139,
    longitude: 77.2090
  });

  const [recyclers, setRecyclers] = useState([]);
  const [selectedRecycler, setSelectedRecycler] = useState(locationState?.preSelectedRecycler || null);

  const [pickupSpots, setPickupSpots] = useState([]);
  const [selectedPickupSpotId, setSelectedPickupSpotId] = useState('');

  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [error, setError] = useState('');

  const categories = [
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

  // Fetch verified recyclers on mount
  useEffect(() => {
    const fetchRecyclers = async () => {
      try {
        const res = await recyclerService.getAll({
          lat: location.latitude,
          lng: location.longitude
        });
        if (res.data?.success) {
          setRecyclers(res.data.data);
          // If none selected yet and partners exist, select the first
          if (!selectedRecycler && res.data.data.length > 0) {
            setSelectedRecycler(res.data.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load verified recyclers:', err);
      } finally {
        setLoadingPartners(false);
      }
    };
    fetchRecyclers();
  }, [location.latitude, location.longitude]);

  // When selected recycler changes, fetch their pickup spots & set default date/slot
  useEffect(() => {
    if (selectedRecycler) {
      const fetchSpots = async () => {
        try {
          const res = await pickupSpotService.getAll({ recyclerId: selectedRecycler._id });
          if (res.data?.success) {
            setPickupSpots(res.data.data);
            if (res.data.data.length > 0) {
              setSelectedPickupSpotId(res.data.data[0]._id);
            }
          }
        } catch (err) {
          console.warn('Failed to load pickup spots:', err);
        }
      };
      fetchSpots();

      // Pre-set default date and time from recycler availability
      if (selectedRecycler.availability?.timeSlots?.length > 0 && !preferredTime) {
        setPreferredTime(selectedRecycler.availability.timeSlots[0]);
      }
      if (!preferredDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setPreferredDate(tomorrow.toISOString().split('T')[0]);
      }
    }
  }, [selectedRecycler]);

  // Add Item to request
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        category: 'Chargers / Cables',
        itemType: '',
        quantity: 1,
        weight: 0,
        condition: 'Dead / Damaged',
        description: ''
      }
    ]);
  };

  // Remove Item
  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Update item field
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Submit Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    for (let i = 0; i < items.length; i++) {
      if (!items[i].itemType || items[i].itemType.trim() === '') {
        setError(`Please specify the item type/model for item #${i + 1}.`);
        window.scrollTo({ top: 100, behavior: 'smooth' });
        return;
      }
      if (!items[i].quantity || items[i].quantity < 1) {
        setError(`Quantity for item #${i + 1} must be at least 1.`);
        return;
      }
    }

    if (!location.address || location.address.trim() === '') {
      setError('Please provide a valid pickup location address.');
      return;
    }

    if (!selectedRecycler) {
      setError('Please choose a verified recycling partner from the options below.');
      return;
    }

    if (!preferredDate || !preferredTime) {
      setError('Please select a collection date and available time slot.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        items,
        recyclerId: selectedRecycler._id,
        preferredDisposalMethod,
        pickupMethod,
        pickupLocation: {
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude
        },
        preferredDate,
        preferredTime,
        selectedPickupSpotId: pickupMethod === 'Nearby Pickup Point' ? selectedPickupSpotId : undefined,
        notes
      };

      const res = await requestService.create(payload);
      if (res.data?.success) {
        // Redirect directly to the generated request details page
        navigate(`/request/${res.data.data._id}`, {
          state: { newRequestSuccess: true }
        });
      }
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to backend server. Please make sure the backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem', maxWidth: '880px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <Sparkles size={14} />
          <span>EcoConnect Community Registration</span>
        </div>
        <h1 className="section-title">Schedule E-Waste Collection</h1>
        <p className="section-subtitle">
          Register one or more electronic items, pinpoint pickup coordinates, and connect with a certified recycling collector.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* SECTION 1: E-WASTE ITEMS */}
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} color="var(--primary)" />
              1. Electronic Items for Disposal
            </h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="btn btn-outline-primary btn-sm"
            >
              <Plus size={15} /> Add Another Item
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Item #{index + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--danger)', padding: '0.2rem 0.5rem', border: 'none' }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Category <span className="required">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={item.category}
                      onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Item Model / Description <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Dell Inspiron Laptop, Galaxy S9"
                      value={item.itemType}
                      onChange={(e) => handleItemChange(index, 'itemType', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Quantity <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      className="form-control"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Approx Weight (kg, optional)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      className="form-control"
                      placeholder="e.g. 1.5"
                      value={item.weight || ''}
                      onChange={(e) => handleItemChange(index, 'weight', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Item Condition <span className="required">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={item.condition}
                      onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                    >
                      <option value="Working">Working (For Refurbishment/Reuse)</option>
                      <option value="Partially Working">Partially Working</option>
                      <option value="Dead / Damaged">Dead / Damaged</option>
                      <option value="Scrap / Unusable">Scrap / Component Parts</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Extra Details
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Missing charger, swollen battery"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-light)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
              Total Items in Request: {items.reduce((acc, it) => acc + (parseInt(it.quantity) || 0), 0)} unit(s)
            </span>
            <button
              type="button"
              onClick={handleAddItem}
              className="btn btn-outline-primary btn-sm"
              style={{ background: '#ffffff' }}
            >
              <Plus size={14} /> Add Item
            </button>
          </div>
        </div>

        {/* SECTION 2: PICKUP METHOD & LOCATION */}
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <MapPin size={20} color="var(--primary)" />
            2. Collection Method & Location
          </h2>

          <div className="form-group">
            <label className="form-label">
              Pickup Preference <span className="required">*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {['Doorstep Pickup', 'Nearby Pickup Point', 'Community Collection Drive'].map((method) => {
                const isSelected = pickupMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPickupMethod(method)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--primary-light)' : '#ffffff',
                      color: isSelected ? 'var(--primary-dark)' : 'var(--text-main)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>{method}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {method === 'Doorstep Pickup'
                        ? 'Collector visits your address'
                        : method === 'Nearby Pickup Point'
                        ? 'Drop at verified kiosk/spot'
                        : 'Scheduled neighborhood event'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Leaflet Map Picker */}
          <MapPicker
            location={location}
            onChange={(newLoc) => setLocation(newLoc)}
            label="Pickup / Collection Location"
          />
        </div>

        {/* SECTION 3: RECYCLER MATCHING & SLOTS */}
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <Truck size={20} color="var(--primary)" />
            3. Recycler Partner & Time Slot
          </h2>

          <div className="form-group">
            <label className="form-label">
              Select Verified Recycler Partner <span className="required">*</span>
            </label>
            {loadingPartners ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Matching nearby verified recyclers...</p>
            ) : recyclers.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {recyclers.map((rec) => (
                  <div
                    key={rec._id}
                    onClick={() => setSelectedRecycler(rec)}
                    style={{ cursor: 'pointer' }}
                  >
                    <RecyclerCard
                      recycler={rec}
                      isSelected={selectedRecycler?._id === rec._id}
                      showSelectButton={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">
                No verified recyclers in database yet. An administrator can verify pending recyclers in the admin dashboard.
              </div>
            )}
          </div>

          {/* If Nearby Pickup Point, show available pickup spots */}
          {pickupMethod === 'Nearby Pickup Point' && (
            <div className="form-group" style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <label className="form-label">
                Choose Drop-off Kiosk / Pickup Spot <span className="required">*</span>
              </label>
              {pickupSpots.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {pickupSpots.map((spot) => {
                    const isSelected = selectedPickupSpotId === spot._id;
                    return (
                      <label
                        key={spot._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          background: isSelected ? 'var(--primary-light)' : '#ffffff',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="radio"
                          name="pickupSpot"
                          checked={isSelected}
                          onChange={() => setSelectedPickupSpotId(spot._id)}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{spot.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{spot.address}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  This partner has not configured external kiosk spots; doorstep pickup will be utilized.
                </p>
              )}
            </div>
          )}

          {/* Date & Time Slot Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Preferred Pickup Date <span className="required">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                min={new Date().toISOString().split('T')[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Available Time Slot <span className="required">*</span>
              </label>
              <select
                className="form-control"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                required
              >
                {selectedRecycler?.availability?.timeSlots && selectedRecycler.availability.timeSlots.length > 0 ? (
                  selectedRecycler.availability.timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))
                ) : (
                  <>
                    <option value="09:00 - 11:00 AM">09:00 - 11:00 AM</option>
                    <option value="11:00 - 01:00 PM">11:00 - 01:00 PM</option>
                    <option value="02:00 - 04:00 PM">02:00 - 04:00 PM</option>
                    <option value="04:00 - 06:00 PM">04:00 - 06:00 PM</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem', marginBottom: 0 }}>
            <label className="form-label">
              Special Handling Instructions / Notes (Optional)
            </label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="e.g. Ring apartment bell 4B; batteries separated in clear plastic bag."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', fontSize: '1.05rem', padding: '0.9rem' }}
          disabled={submitting}
        >
          <Send size={18} />
          {submitting ? 'Registering E-Waste Request...' : 'Submit Collection Request'}
        </button>
      </form>
    </div>
  );
};

export default SubmitEWastePage;
