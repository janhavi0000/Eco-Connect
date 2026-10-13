import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, Menu, X, User, LogOut, ShieldAlert, Truck, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMobile}>
          <div className="brand-icon">
            <Recycle size={22} />
          </div>
          <span>EcoConnect</span>
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/how-it-works" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
                How It Works
              </NavLink>
            </li>
            <li>
              <NavLink to="/find-recycler" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
                Find Recycler
              </NavLink>
            </li>
            <li>
              <NavLink to="/awareness" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
                Awareness
              </NavLink>
            </li>
            <li>
              <NavLink to="/survey" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
                Community Survey
              </NavLink>
            </li>

            {/* Role-Specific Portal Links */}
            {user?.role === 'user' && (
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
                  My Dashboard
                </NavLink>
              </li>
            )}

            {user?.role === 'recycler' && (
              <li>
                <NavLink to="/recycler-dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
                  <Truck size={15} style={{ display: 'inline', marginRight: '4px' }} />
                  Recycler Hub
                </NavLink>
              </li>
            )}

            {user?.role === 'admin' && (
              <li>
                <NavLink to="/admin-dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMobile}>
                  <ShieldAlert size={15} style={{ display: 'inline', marginRight: '4px' }} />
                  Admin Panel
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Action Buttons & User Menu */}
        <div className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to={
                  user.role === 'admin'
                    ? '/admin-dashboard'
                    : user.role === 'recycler'
                    ? '/recycler-dashboard'
                    : '/dashboard'
                }
                className="btn btn-outline-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={closeMobile}
              >
                <User size={15} />
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]} ({user.role})
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Log out"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <Sparkles size={14} /> Dispose Responsibly
              </Link>
            </div>
          )}

          {/* Hamburger Menu on Mobile */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
