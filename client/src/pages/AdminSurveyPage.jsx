import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowLeft,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

const COLORS = ['#059669', '#0d9488', '#0284c7', '#f59e0b', '#dc2626', '#8b5cf6'];

const AdminSurveyPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveyData = async () => {
      setLoading(true);
      try {
        const [anaRes, respRes] = await Promise.all([
          adminService.getSurveyAnalytics(),
          adminService.getSurveyResponses()
        ]);

        if (anaRes.data?.success) setAnalytics(anaRes.data.data);
        if (respRes.data?.success) setResponses(respRes.data.data);
      } catch (err) {
        console.error('Failed to load survey data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveyData();
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin-dashboard" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={15} /> Back to Admin Overview
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Community Survey Analytics & Insights
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Empirical data from the 10-question CEP e-waste community engagement proposal survey
          </p>
        </div>

        <span className="badge badge-accepted" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
          {analytics?.totalResponses || 0} Total Responses
        </span>
      </div>

      {loading ? (
        <LoadingSpinner text="Aggregating community survey responses from MongoDB..." />
      ) : analytics && analytics.totalResponses > 0 ? (
        <>
          {/* Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
            {/* 1. Awareness */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Q1. E-Waste Awareness</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Residents aware of what constitutes e-waste
              </p>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={analytics.awareness}
                      dataKey="count"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.awareness.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Main Difficulties */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Q6. Main Disposal Difficulties</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Key barriers faced by household members
              </p>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <BarChart data={analytics.difficulties} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="label" type="category" width={110} tick={{ fontSize: 9 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#d97706" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Preferred Disposal Method */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Q7. Preferred Collection Method</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Community preference for doorstep vs kiosk collection
              </p>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <BarChart data={analytics.preferredMethods} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" angle={-15} textAnchor="end" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4. Platform Willingness */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Q8. Online Platform Adoption</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Would use EcoConnect to connect with nearby recyclers
              </p>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={analytics.platformWillingness}
                      dataKey="count"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.platformWillingness.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Individual Submissions Log */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              Individual Community Responses ({responses.length})
            </h3>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Respondent</th>
                    <th>Date</th>
                    <th>E-Waste Types</th>
                    <th>Current Practice</th>
                    <th>Main Difficulty</th>
                    <th>Preferred Method</th>
                    <th>Platform Willingness</th>
                    <th>Community Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((resp) => (
                    <tr key={resp._id}>
                      <td style={{ fontWeight: 600 }}>{resp.respondentName}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(resp.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {resp.q3_itemTypes?.join(', ')}
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{resp.q4_currentPractice}</td>
                      <td style={{ fontSize: '0.85rem' }}>{resp.q6_mainDifficulty}</td>
                      <td style={{ fontSize: '0.85rem' }}>{resp.q7_preferredMethod}</td>
                      <td>
                        <span className={`badge ${resp.q8_wouldUsePlatform === 'Yes' ? 'badge-collected' : 'badge-pending'}`}>
                          {resp.q8_wouldUsePlatform}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: resp.comments ? 'italic' : 'normal' }}>
                        {resp.comments || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No survey responses recorded yet"
          description="Community survey responses submitted via the public survey page will appear here."
          actionText="Visit Community Survey Page"
          actionLink="/survey"
        />
      )}
    </div>
  );
};

export default AdminSurveyPage;
