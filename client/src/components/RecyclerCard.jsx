import React from 'react';
import { Building2, MapPin, Phone, Mail, CheckCircle2, Calendar, Clock, Layers } from 'lucide-react';

const RecyclerCard = ({ recycler, onSelect, isSelected = false, showSelectButton = true }) => {
  return (
    <div
      className="card"
      style={{
        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
        boxShadow: isSelected ? '0 0 0 3px rgba(5, 150, 105, 0.15)' : 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {recycler.organizationName}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              <Building2 size={14} />
              <span>Contact: {recycler.contactPerson}</span>
            </div>
          </div>
          {recycler.verificationStatus === 'VERIFIED' ? (
            <span className="badge badge-verified" title="Verified CEP E-Waste Partner">
              <CheckCircle2 size={13} /> Verified
            </span>
          ) : (
            <span className="badge badge-pending">
              {recycler.verificationStatus}
            </span>
          )}
        </div>

        {recycler.distanceKm !== undefined && recycler.distanceKm !== null && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--secondary-light)', color: 'var(--secondary-hover)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.85rem' }}>
            <MapPin size={13} />
            <span>Approx. {recycler.distanceKm} km away</span>
          </div>
        )}

        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
          {recycler.description || 'Community authorized e-waste recycler.'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--text-main)', marginBottom: '1.25rem', background: 'var(--bg-main)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <MapPin size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{recycler.address}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={15} color="var(--secondary)" />
            <span>{recycler.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={15} color="var(--secondary)" />
            <span>{recycler.email}</span>
          </div>
        </div>

        {/* Service Areas */}
        {recycler.serviceAreas && recycler.serviceAreas.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Service Areas Covered
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {recycler.serviceAreas.map((area, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.78rem',
                    background: '#f1f5f9',
                    color: '#334155',
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 500
                  }}
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Supported Categories */}
        {recycler.supportedCategories && recycler.supportedCategories.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Layers size={13} />
              <span>Accepted Categories</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {recycler.supportedCategories.slice(0, 5).map((cat, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.78rem',
                    background: 'var(--primary-light)',
                    color: 'var(--primary-dark)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 500
                  }}
                >
                  {cat}
                </span>
              ))}
              {recycler.supportedCategories.length > 5 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                  +{recycler.supportedCategories.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Availability */}
        {recycler.availability && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            {recycler.availability.days && recycler.availability.days.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} color="var(--primary)" />
                <span>Days: {recycler.availability.days.join(', ')}</span>
              </div>
            )}
            {recycler.availability.timeSlots && recycler.availability.timeSlots.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} color="var(--secondary)" />
                <span>Slots: {recycler.availability.timeSlots.slice(0, 2).join(' | ')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {showSelectButton && onSelect && (
        <button
          type="button"
          onClick={() => onSelect(recycler)}
          className={`btn ${isSelected ? 'btn-primary' : 'btn-outline-primary'}`}
          style={{ width: '100%', marginTop: '0.75rem' }}
        >
          {isSelected ? '✓ Selected Collector' : 'Select This Recycler'}
        </button>
      )}
    </div>
  );
};

export default RecyclerCard;
