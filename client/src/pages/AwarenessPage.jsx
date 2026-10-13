import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Smartphone,
  Laptop,
  BatteryCharging,
  Cpu,
  Headphones,
  Keyboard,
  Monitor,
  Flame,
  Trash2,
  Wrench,
  Repeat,
  Truck,
  Leaf
} from 'lucide-react';

const AwarenessPage = () => {
  const ewasteExamples = [
    { title: 'Mobile Phones & Tablets', icon: Smartphone, desc: 'Smartphones, feature phones, screen assemblies and tablets.' },
    { title: 'Computers & Laptops', icon: Laptop, desc: 'Desktops, laptops, CPUs, motherboards, circuit boards and power supplies.' },
    { title: 'Chargers, Cables & Adapters', icon: Cpu, desc: 'Power bricks, USB wires, wall adapters and power strips.' },
    { title: 'Batteries & Power Banks', icon: BatteryCharging, desc: 'Rechargeable lithium-ion packs, button cells, and external battery units.' },
    { title: 'Keyboards & Peripherals', icon: Keyboard, desc: 'Keyboards, computer mice, webcams, barcode scanners, and input devices.' },
    { title: 'Headphones & Audio Gear', icon: Headphones, desc: 'Earphones, wired headsets, Bluetooth earphones, and portable speakers.' },
    { title: 'Monitors & Displays', icon: Monitor, desc: 'LCD/LED monitors, broken laptop screens, and video display terminals.' },
    { title: 'Electronic Accessories', icon: Leaf, desc: 'Smartwatches, fitness bands, calculators, remote controls, and routers.' }
  ];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1rem' }}>
          <Leaf size={14} />
          <span>Community Environmental Education</span>
        </div>
        <h1 className="section-title">Responsible E-Waste Disposal</h1>
        <p className="section-subtitle">
          Understanding the lifecycle of electronic devices, their environmental impacts, and practical steps to ensure safe community handling.
        </p>
      </div>

      {/* What is E-Waste? */}
      <div className="card" style={{ marginBottom: '3rem', padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>
          What is Electronic Waste (E-Waste)?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Electronic waste, commonly referred to as <strong>e-waste</strong>, encompasses any discarded electrical or electronic equipment, whether operational, broken, obsolete, or unwanted. As consumer electronics update rapidly, discarded devices accumulate in homes, dormitories, and workplaces.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.7 }}>
          Unlike ordinary organic or paper waste, electronics contain both valuable secondary raw materials (such as copper, aluminum, and recoverable metals) as well as hazardous chemical substances (including lead, mercury, cadmium, and brominated flame retardants).
        </p>
      </div>

      {/* Examples Grid */}
      <div style={{ marginBottom: '3.5rem' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Common Categories of E-Waste
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {ewasteExamples.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Responsible Disposal Matters */}
      <div className="card" style={{ marginBottom: '3.5rem', padding: '2.5rem', background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
          Why Responsible Disposal Matters
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} color="var(--primary)" />
              Prevents Soil & Groundwater Contamination
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              When electronics sit in unlined municipal landfills, weathering and acid rain cause toxic metals like lead, mercury, and cadmium to leach into local soil and subterranean groundwater tables.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Repeat size={18} color="var(--secondary)" />
              Conserves Finite Natural Resources
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Extracting virgin copper, gold, and rare earth minerals through mining has intensive environmental footprints. Certified recycling enables safe secondary resource recovery.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="var(--warning)" />
              Mitigates Informal Scrap Hazards
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Informal, open-air dismantling often exposes local waste workers to toxic fumes and acid baths. Authorized recyclers utilize protective facilities and controlled recovery technologies.
            </p>
          </div>
        </div>
      </div>

      {/* DO's and DON'Ts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
        {/* What NOT to do */}
        <div className="card" style={{ borderColor: '#fecaca', background: '#fffafa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--danger)', marginBottom: '1.25rem' }}>
            <XCircle size={26} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>What NOT To Do</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Trash2 size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Do not throw e-waste with normal household waste:</strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Electronic gadgets mixed into general household dustbins enter routine dump yards and municipal trash compactors.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Flame size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Do not burn electronic waste:</strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Open-air burning of insulation wires and plastics releases carcinogenic dioxins, furans, and hazardous fumes into neighborhood air.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <BatteryCharging size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Do not improperly dispose of or puncture batteries:</strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Crushed or punctured lithium-ion cells can short-circuit and cause combustion fires in waste trucks or waste sorting depots.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What Users CAN Do */}
        <div className="card" style={{ borderColor: '#bbf7d0', background: '#f7fdf9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--success)', marginBottom: '1.25rem' }}>
            <CheckCircle size={26} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>What You CAN Do</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Repeat size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Reuse when possible:</strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Pass working devices to family members, junior students, or community charities rather than letting them idle in drawers.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Wrench size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Repair when feasible:</strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Explore minor component replacements (e.g. fresh phone battery or new charging cable) before retiring an entire device.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Truck size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Hand over to authorized recyclers & collection points:</strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Use the EcoConnect platform to schedule doorstep pickup or deposit items at verified campus kiosks for certified handling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div style={{ textAlign: 'center' }}>
        <Link to="/submit-ewaste" className="btn btn-primary btn-lg">
          Schedule Responsible Collection Now
        </Link>
      </div>
    </div>
  );
};

export default AwarenessPage;
