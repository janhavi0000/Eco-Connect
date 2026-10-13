import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Recycle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      number: '01',
      title: 'Register Your E-Waste Details',
      desc: 'Fill out our simple form with your unused electronic items. Group multiple items like obsolete phones, laptop adapters, damaged keyboards, or dead batteries into one convenient submission.',
      icon: FileText,
      points: [
        'Select categories and item models',
        'State item condition (Working, Damaged, Scrap)',
        'Estimate weight and specify quantity'
      ]
    },
    {
      number: '02',
      title: 'Choose Collection Method & Location',
      desc: 'Decide whether you prefer convenient doorstep pickup from your residence or wish to drop items at a verified community / campus kiosk point.',
      icon: MapPin,
      points: [
        'Pin exact location on interactive OpenStreetMap',
        'Use browser geolocation or type address',
        'Pick from doorstep, pickup kiosk, or drive drive'
      ]
    },
    {
      number: '03',
      title: 'Select Recycler & Book Time Slot',
      desc: 'Browse verified local recyclers matched to your neighborhood. Select an available collection date and reserved time slot that prevents double-booking.',
      icon: Clock,
      points: [
        'See recycler verification credentials and distance',
        'Select official operating days & hours',
        'Receive instant submission confirmation and Request ID'
      ]
    },
    {
      number: '04',
      title: 'Collection & Permanent Recycling Record',
      desc: 'The recycler verifies and picks up the electronics. Upon completion, a permanent collection record is digitally generated in the community registry.',
      icon: CheckCircle2,
      points: [
        'Real-time status tracking: Pending → Accepted → Scheduled → Collected',
        'Full status history timeline with notes',
        'Guaranteed zero-landfill processing'
      ]
    }
  ];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1rem' }}>
          <Sparkles size={14} />
          <span>Streamlined Community Workflow</span>
        </div>
        <h1 className="section-title">How EcoConnect Operates</h1>
        <p className="section-subtitle">
          From obsolete electronics sitting in drawers to certified eco-friendly dismantling — here is how our platform connects you with local collection partners.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="card"
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '2rem',
                alignItems: 'flex-start',
                padding: '2rem'
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}
              >
                <Icon size={26} />
                <span style={{ fontSize: '0.78rem', marginTop: '2px', color: 'var(--primary-dark)' }}>{step.number}</span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.6rem', color: 'var(--text-main)' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {step.desc}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem' }}>
                  {step.points.map((pt, pIdx) => (
                    <div key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2.5rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Ready to dispose of your e-waste responsibly?</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Schedule a collection in under two minutes and help prevent toxic heavy metals from reaching landfills.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/submit-ewaste" className="btn btn-primary btn-lg">
            Schedule Collection <ArrowRight size={18} />
          </Link>
          <Link to="/find-recycler" className="btn btn-outline btn-lg">
            Find Nearby Recycler
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
