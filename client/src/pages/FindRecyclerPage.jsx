import React, { useState, useEffect } from 'react';
import { recyclerService } from '../services/api';
import RecyclerCard from '../components/RecyclerCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Search, MapPin, Filter, Navigation, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FindRecyclerPage = () => {
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

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

  const fetchRecyclers = async (lat, lng) => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All Categories') {
        params.category = selectedCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
      }

      const res = await recyclerService.getAll(params);
      if (res.data?.success) {
        setRecyclers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load recyclers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecyclers(userLocation?.lat, userLocation?.lng);
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecyclers(userLocation?.lat, userLocation?.lng);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        fetchRecyclers(coords.lat, coords.lng);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        alert('Could not determine your current position. Showing all verified partners.');
      }
    );
  };

  const handleSelectRecycler = (recycler) => {
    // Navigate to submit-ewaste with this recycler pre-selected
    navigate('/submit-ewaste', { state: { preSelectedRecycler: recycler } });
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem auto' }}>
        <h1 className="section-title">Verified E-Waste Recyclers & Collection Points</h1>
        <p className="section-subtitle">
          Find authorized local facilities and certified collection partners equipped to dismantle and recover secondary materials safely.
        </p>
      </div>

      {/* Filters & Location search bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: '1 1 300px', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, address, or service area..."
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-control"
              style={{ width: 'auto', padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={locating}
            className="btn btn-outline-primary btn-sm"
          >
            <Navigation size={14} />
            {locating ? 'Locating...' : userLocation ? '📍 Location Applied' : 'Sort by Distance'}
          </button>
        </div>
      </div>

      {/* Recyclers Grid */}
      {loading ? (
        <LoadingSpinner text="Querying verified recyclers in MongoDB..." />
      ) : recyclers.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {recyclers.map((rec) => (
            <RecyclerCard
              key={rec._id}
              recycler={rec}
              onSelect={handleSelectRecycler}
              showSelectButton={true}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No verified recyclers found"
          description="Try broadening your search criteria or removing the category filter. New partners are added as registrations are verified."
          actionText="Reset Search"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('');
            fetchRecyclers();
          }}
        />
      )}
    </div>
  );
};

export default FindRecyclerPage;
