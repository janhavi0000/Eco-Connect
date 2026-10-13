import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

// Fix Leaflet marker icon asset issue in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Component to handle map clicks
const LocationClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

// Component to center map smoothly
const MapViewUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapPicker = ({
  location = { address: '', latitude: 28.6139, longitude: 77.2090 },
  onChange,
  readOnly = false,
  label = 'Pickup Location'
}) => {
  const [coords, setCoords] = useState([location.latitude || 28.6139, location.longitude || 77.2090]);
  const [addressInput, setAddressInput] = useState(location.address || '');
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState('');

  useEffect(() => {
    if (location.latitude && location.longitude) {
      setCoords([location.latitude, location.longitude]);
    }
    if (location.address) {
      setAddressInput(location.address);
    }
  }, [location.latitude, location.longitude, location.address]);

  // Reverse geocode using OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'EcoConnect-CEP-Platform' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          const formatted = data.display_name.split(',').slice(0, 4).join(', ');
          setAddressInput(formatted);
          onChange({
            address: formatted,
            latitude: lat,
            longitude: lon
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Reverse geocoding unavailable, fallback to existing address:', e.message);
    }

    // Fallback if reverse geocode fails
    onChange({
      address: addressInput || `Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      latitude: lat,
      longitude: lon
    });
  };

  const handleMapClick = (lat, lng) => {
    if (readOnly) return;
    setCoords([lat, lng]);
    reverseGeocode(lat, lng);
  };

  const handleUseCurrentLocation = () => {
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords([lat, lng]);
        reverseGeocode(lat, lng);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Location permission was denied. You can manually click on the map or enter your address below.');
        } else {
          setGeoError('Unable to retrieve your current location. Please select it manually on the map.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setAddressInput(val);
    onChange({
      address: val,
      latitude: coords[0],
      longitude: coords[1]
    });
  };

  return (
    <div className="form-group">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          {label} <span className="required">*</span>
        </label>
        {!readOnly && (
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="btn btn-outline-primary btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
          >
            <Navigation size={14} />
            {locating ? 'Detecting Location...' : 'Use My Current Location'}
          </button>
        )}
      </div>

      {geoError && (
        <div className="alert alert-info" style={{ padding: '0.5rem 0.75rem', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
          <AlertCircle size={16} />
          <span>{geoError}</span>
        </div>
      )}

      {!readOnly && (
        <div style={{ marginBottom: '0.75rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter street address, building, or area name"
            value={addressInput}
            onChange={handleAddressChange}
            required
          />
          <div className="form-help">
            Tip: You can type an address above or click directly anywhere on the map to pin your location.
          </div>
        </div>
      )}

      <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <MapContainer
          center={coords}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: readOnly ? '240px' : '320px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coords} />
          {!readOnly && <LocationClickHandler onLocationSelect={handleMapClick} />}
          <MapViewUpdater center={coords} />
        </MapContainer>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <MapPin size={14} color="var(--primary)" />
        <span>
          Selected Coordinates: {coords[0]?.toFixed(4)}, {coords[1]?.toFixed(4)}
        </span>
      </div>
    </div>
  );
};

export default MapPicker;
