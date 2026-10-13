import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Heart, ShieldCheck, Globe, Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary-dark)' }}>
              <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
                <Recycle size={18} />
              </div>
              <span>EcoConnect</span>
            </div>
            <p>
              Community-Based E-Waste Collection & Recycler Connection Platform.
              An academic Community Engagement Program (CEP) initiative designed to connect households with verified electronic recyclers.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600 }}>
              <Leaf size={16} />
              <span>Connect • Collect • Recycle</span>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Overview</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/find-recycler">Find Recyclers</Link></li>
              <li><Link to="/submit-ewaste">Schedule Pickup</Link></li>
              <li><Link to="/survey">Community Survey</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Education</h4>
            <ul className="footer-links">
              <li><Link to="/awareness">What is E-Waste?</Link></li>
              <li><Link to="/awareness#hazards">Toxicity & Hazards</Link></li>
              <li><Link to="/awareness#dos-donts">Do's and Don'ts</Link></li>
              <li><Link to="/register-recycler">Join as Recycler Partner</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">CEP Project Info</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <p>
                <strong>Academic Purpose:</strong> College Community Engagement Program (CEP)
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                <strong>Impact Goal:</strong> Zero electronic waste in community municipal landfills through organized neighborhood collection points.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} EcoConnect CEP Platform. Built for community sustainability.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={14} color="var(--primary)" /> Verified Recycling
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Globe size={14} color="var(--secondary)" /> Clean Communities
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
