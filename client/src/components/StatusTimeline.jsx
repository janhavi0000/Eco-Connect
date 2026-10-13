import React from 'react';
import { CheckCircle2, Clock, Calendar, CheckCheck, XCircle, AlertCircle } from 'lucide-react';

const StatusTimeline = ({ currentStatus, statusHistory = [] }) => {
  const steps = [
    { key: 'PENDING', label: '1. Request Submitted', icon: Clock },
    { key: 'ACCEPTED', label: '2. Accepted by Recycler', icon: CheckCircle2 },
    { key: 'SCHEDULED', label: '3. Pickup Scheduled', icon: Calendar },
    { key: 'COLLECTED', label: '4. E-Waste Collected', icon: CheckCheck }
  ];

  const statusOrder = ['PENDING', 'ACCEPTED', 'SCHEDULED', 'COLLECTED'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  const isTerminalNegative = currentStatus === 'CANCELLED' || currentStatus === 'REJECTED';

  const findHistoryEntry = (statusKey) => {
    return statusHistory.find((h) => h.status === statusKey);
  };

  return (
    <div>
      <div className="status-timeline">
        {steps.map((step, idx) => {
          const entry = findHistoryEntry(step.key);
          const isCompleted = currentIndex >= idx && !isTerminalNegative;
          const isCurrent = currentStatus === step.key;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className={`timeline-step ${isCompleted ? 'completed' : ''}`}
            >
              <div
                className="timeline-icon"
                style={{
                  backgroundColor: isCompleted ? 'var(--primary)' : isCurrent ? 'var(--accent)' : '#f1f5f9',
                  color: isCompleted || isCurrent ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                <Icon size={16} />
              </div>
              <div className="timeline-content">
                <div
                  className="timeline-title"
                  style={{
                    color: isCompleted || isCurrent ? 'var(--text-main)' : 'var(--text-light)'
                  }}
                >
                  {step.label}
                  {isCurrent && !isTerminalNegative && (
                    <span
                      style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.75rem',
                        background: 'var(--primary-light)',
                        color: 'var(--primary-dark)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        fontWeight: 600
                      }}
                    >
                      Current Status
                    </span>
                  )}
                </div>

                {entry ? (
                  <>
                    <div className="timeline-time">
                      {new Date(entry.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {entry.note && <div className="timeline-note">{entry.note}</div>}
                  </>
                ) : (
                  <div className="timeline-time" style={{ color: 'var(--text-light)' }}>
                    Pending progress
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* If Cancelled or Rejected, show terminal banner */}
        {isTerminalNegative && (
          <div className="timeline-step">
            <div
              className="timeline-icon"
              style={{
                backgroundColor: currentStatus === 'CANCELLED' ? '#64748b' : '#dc2626',
                color: '#ffffff'
              }}
            >
              {currentStatus === 'CANCELLED' ? <AlertCircle size={16} /> : <XCircle size={16} />}
            </div>
            <div className="timeline-content">
              <div className="timeline-title" style={{ color: 'var(--danger)' }}>
                Request {currentStatus === 'CANCELLED' ? 'Cancelled' : 'Rejected'}
              </div>
              {statusHistory.find((h) => h.status === currentStatus) && (
                <>
                  <div className="timeline-time">
                    {new Date(
                      statusHistory.find((h) => h.status === currentStatus).timestamp
                    ).toLocaleString()}
                  </div>
                  <div className="timeline-note">
                    {statusHistory.find((h) => h.status === currentStatus).note ||
                      `Request was ${currentStatus.toLowerCase()}.`}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusTimeline;
