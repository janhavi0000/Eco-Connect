import React from 'react';

const StatsCard = ({ icon: Icon, title, value, color = 'green', subtitle }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div className="stat-info">
        <div className="stat-value">{value !== undefined && value !== null ? value : 0}</div>
        <div className="stat-label">{title}</div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
