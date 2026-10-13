import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading details...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1rem', gap: '0.85rem' }}>
      <Loader2 size={36} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 500 }}>{text}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
