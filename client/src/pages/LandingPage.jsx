import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  CalendarCheck,
  Recycle,
  CheckCircle2,
  Users,
  ShieldCheck,
  Truck,
  Smartphone,
  Laptop,
  BatteryCharging,
  Cpu,
  Headphones,
  ClipboardList
} from 'lucide-react';
import StatsCard from '../components/StatsCard';

const LandingPage = () => {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load dynamic landing statistics:', err.message);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const categories = [
    { name: 'Mobile Phones', icon: Smartphone, desc: 'Smartphones, feature phones, cracked screens' },
    { name: 'Laptops / Computers', icon: Laptop, desc: 'Notebooks, PCs, motherboards, RAM' },
    { name: 'Batteries', icon: BatteryCharging, desc: 'Lithium power banks, lead batteries' },
    { name: 'Cables & Accessories', icon: Cpu, desc: 'Chargers, adapters, USB cords' },
    { name: 'Audio Equipment', icon: Headphones, desc: 'Headphones, earphones, speakers' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: '3.5rem 0 2.5rem 0', background: 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                <Sparkles size={14} />
                <span>College Community Engagement Program (CEP)</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
                Give Your E-Waste a Better Destination.
              </h1>
              <p style={{ fontSize: '1.12rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '540px' }}>
                Connect with nearby e-waste recyclers and collection points, schedule a convenient pickup, and contribute to a cleaner community.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                <Link to="/submit-ewaste" className="btn btn-primary btn-lg">
                  <CalendarCheck size={18} /> Schedule E-Waste Collection
                </Link>
                <Link to="/find-recycler" className="btn btn-outline btn-lg">
                  <MapPin size={18} color="var(--primary)" /> Find Nearby Recycler
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} color="var(--primary)" />
                  <span>Verified Recyclers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Recycle size={16} color="var(--secondary)" />
                  <span>Zero-Landfill Processing</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                  width: '100%',
                  maxWidth: '480px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary-dark)' }}>
                    <Recycle size={20} color="var(--primary)" />
                    <span>EcoConnect Platform</span>
                  </div>
                  <span className="badge badge-accepted">Community Live</span>
                </div>

                <div style={{ background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Quick Disposal Steps</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>4 Simple Steps</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ width: '22px', height: '22px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>1</span>
                      <span>Itemize electronic items & quantity</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ width: '22px', height: '22px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>2</span>
                      <span>Select location & doorstep / kiosk pickup</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ width: '22px', height: '22px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>3</span>
                      <span>Choose verified recycler & convenient slot</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ width: '22px', height: '22px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>4</span>
                      <span>Track status & verify recycling record</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link to="/survey" className="btn btn-outline-primary" style={{ flex: 1, fontSize: '0.88rem', padding: '0.6rem' }}>
                    <ClipboardList size={16} /> Take Survey
                  </Link>
                  <Link to="/awareness" className="btn btn-outline" style={{ flex: 1, fontSize: '0.88rem', padding: '0.6rem' }}>
                    Learn Why It Matters
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Statistics Section (Loaded directly from MongoDB) */}
      <section style={{ padding: '3rem 0', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Live Community Impact
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Real-time platform metrics powered directly by our community database
            </p>
          </div>

          {loadingStats ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
              Loading dynamic statistics from MongoDB...
            </div>
          ) : stats && (stats.totalRequests > 0 || stats.verifiedRecyclers > 0) ? (
            <div className="dashboard-grid">
              <StatsCard
                icon={ClipboardList}
                title="Total Requests"
                value={stats.totalRequests}
                color="green"
                subtitle="Community collection orders"
              />
              <StatsCard
                icon={Recycle}
                title="E-Waste Collected"
                value={`${stats.totalQuantityCollected} Items`}
                color="teal"
                subtitle={stats.totalWeightCollected ? `Approx. ${stats.totalWeightCollected} kg` : 'Safely diverted from landfill'}
              />
              <StatsCard
                icon={Truck}
                title="Active Collectors"
                value={stats.verifiedRecyclers}
                color="blue"
                subtitle="Verified recycling partners"
              />
              <StatsCard
                icon={Users}
                title="Community Participants"
                value={stats.totalUsers}
                color="purple"
                subtitle="Registered residents & members"
              />
            </div>
          ) : (
            <div className="empty-state" style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem' }}>
              <div className="empty-state-icon" style={{ width: '48px', height: '48px' }}>
                <Recycle size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem' }}>No Collection Records Yet</h3>
              <p style={{ fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                Our community network is ready for its first collection requests. Register your unwanted electronics to lead the sustainability drive!
              </p>
              <Link to="/submit-ewaste" className="btn btn-primary btn-sm">
                Submit First Request
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CEP Project Presentation Poster Showcase */}
      <section style={{ padding: '3.5rem 0', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2rem auto' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Academic Presentation & Project Infographic
            </span>
            <h2 className="section-title" style={{ marginTop: '0.35rem' }}>
              EcoConnect CEP Project Poster
            </h2>
            <p className="section-subtitle" style={{ marginBottom: '1.25rem' }}>
              Official Community Engagement Program (CEP) concept overview illustrating user workflow, key features, and neighborhood collection impact.
            </p>
          </div>

          <div style={{ maxWidth: '980px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border)',
                background: '#ffffff'
              }}
            >
              <img
                src="/ecoconnect_cep_poster.jpg"
                alt="EcoConnect CEP Infographic Poster"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <a
                href="/ecoconnect_cep_poster.jpg"
                download="EcoConnect_CEP_Poster.jpg"
                className="btn btn-outline-primary btn-sm"
              >
                📥 Download High-Res CEP Poster
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simple 4-Step Process
            </span>
            <h2 className="section-title" style={{ marginTop: '0.35rem' }}>
              How EcoConnect Works
            </h2>
            <p className="section-subtitle">
              We make responsible electronic waste recycling as easy as ordering a pickup.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.75rem' }}>
            <div className="card" style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontSize: '1.25rem', fontWeight: 800 }}>
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Register Your E-Waste</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Select categories, item types, and quantities. You can submit multiple e-waste items in a single request.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--secondary-light)', color: 'var(--secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontSize: '1.25rem', fontWeight: 800 }}>
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Choose Collection Option</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Pick doorstep pickup or drop off at a nearby verified campus/community kiosk with convenient time slots.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#fef3c7', color: '#d97706', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontSize: '1.25rem', fontWeight: 800 }}>
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Recycler Accepts</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                A verified partner confirms the pickup schedule, and you track live status updates through the platform.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#dcfce7', color: '#15803d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontSize: '1.25rem', fontWeight: 800 }}>
                4
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Responsible Recycling</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Items are collected safely, recorded in the community registry, and handed over for certified processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ padding: '4rem 0', background: '#ffffff', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <h2 className="section-title">What Electronic Items Can You Dispose?</h2>
            <p className="section-subtitle">
              We connect you with certified handlers for commonly accumulated consumer and student electronics.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.85rem auto' }}>
                    <Icon size={24} />
                  </div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>{cat.name}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{cat.desc}</p>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/submit-ewaste" className="btn btn-primary">
              Register Your Items Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Community Survey Banner */}
      <section style={{ padding: '3.5rem 0', background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)', color: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <span style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Community Engagement Proposal
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                Help Shape Community E-Waste Policies
              </h2>
              <p style={{ color: '#d1fae5', fontSize: '1rem', lineHeight: 1.6, maxWidth: '500px' }}>
                Take our 10-question community survey to share disposal difficulties, preferred timings, and feature requests. Your responses inform collection drives!
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Link to="/survey" className="btn" style={{ background: '#ffffff', color: '#064e3b', fontWeight: 700, padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                <ClipboardList size={18} /> Participate in Survey
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
