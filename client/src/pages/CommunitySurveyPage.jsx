import React, { useState } from 'react';
import { surveyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, CheckCircle2, AlertCircle, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CommunitySurveyPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    respondentName: user ? user.name : '',
    q1_awareness: '',
    q2_hasUnusedItems: '',
    q3_itemTypes: [],
    q4_currentPractice: '',
    q5_knowsRecycler: '',
    q6_mainDifficulty: '',
    q7_preferredMethod: '',
    q8_wouldUsePlatform: '',
    q9_usefulFeatures: [],
    q10_willingToParticipate: '',
    comments: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      const currentList = prev[field] || [];
      if (currentList.includes(value)) {
        return { ...prev, [field]: currentList.filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...currentList, value] };
      }
    });
  };

  const handleRadioChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (
      !formData.q1_awareness ||
      !formData.q2_hasUnusedItems ||
      formData.q3_itemTypes.length === 0 ||
      !formData.q4_currentPractice ||
      !formData.q5_knowsRecycler ||
      !formData.q6_mainDifficulty ||
      !formData.q7_preferredMethod ||
      !formData.q8_wouldUsePlatform ||
      formData.q9_usefulFeatures.length === 0 ||
      !formData.q10_willingToParticipate
    ) {
      setError('Please answer all 10 questions before submitting the survey.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await surveyService.submit(formData);
      if (res.data?.success) {
        setSubmitted(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit survey. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '640px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Thank You for Participating!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your feedback has been saved to our community database. The Community Engagement Program (CEP) team will use these insights to optimize future neighborhood collection drives and pickup schedules.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/submit-ewaste" className="btn btn-primary">
              Schedule an E-Waste Pickup
            </Link>
            <Link to="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem', maxWidth: '820px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <Sparkles size={14} />
          <span>CEP Community Engagement Survey</span>
        </div>
        <h1 className="section-title">Community E-Waste Perception Survey</h1>
        <p className="section-subtitle">
          Help our college CEP initiative understand local e-waste disposal habits and design effective neighborhood collection solutions.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Optional Name */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              Your Name (Optional)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Alex Rivera or leave blank for Anonymous"
              value={formData.respondentName}
              onChange={(e) => setFormData({ ...formData, respondentName: e.target.value })}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

          {/* Q1 */}
          <div>
            <label className="form-label" style={{ fontSize: '0.98rem' }}>
              1. Are you aware of what constitutes e-waste? <span className="required">*</span>
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {['Yes', 'No', 'Somewhat'].map((opt) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.92rem' }}>
                  <input
                    type="radio"
                    name="q1"
                    checked={formData.q1_awareness === opt}
                    onChange={() => handleRadioChange('q1_awareness', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div>
            <label className="form-label" style={{ fontSize: '0.98rem' }}>
              2. Do you currently have any unused or damaged electronic items at home? <span className="required">*</span>
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              {['Yes', 'No'].map((opt) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.92rem' }}>
                  <input
                    type="radio"
                    name="q2"
                    checked={formData.q2_hasUnusedItems === opt}
                    onChange={() => handleRadioChange('q2_hasUnusedItems', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q3 */}
          <div>
            <label className="form-label" style={{ fontSize: '0.98rem' }}>
              3. What type of e-waste do you usually have? (Select all that apply) <span className="required">*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', marginTop: '0.5rem' }}>
              {[
                'Mobile phones',
                'Chargers/cables',
                'Batteries',
                'Laptops/computers',
                'Earphones/headphones',
                'Other electronic devices'
              ].map((item) => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.q3_itemTypes.includes(item)}
                    onChange={() => handleCheckboxChange('q3_itemTypes', item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q4 */}
          <div>
            <label className="form-label" style={{ fontSize: '0.98rem' }}>
              4. What do you usually do with unwanted electronic items? <span className="required">*</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
              {[
                'Keep them at home',
                'Throw them with regular waste',
                'Give them to a scrap dealer',
                'Give them to an e-waste recycler',
                'Other'
              ].map((opt) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="q4"
                    checked={formData.q4_currentPractice === opt}
                    onChange={() => handleRadioChange('q4_currentPractice', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q5 */}
          <div>
            <label className="form-label" style={{ fontSize: '0.98rem' }}>
              5. Do you know about any e-waste recycler or collection point near your area? <span className="required">*</span>
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              {['Yes', 'No'].map((opt) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.92rem' }}>
                  <input
                    type="radio"
                    name="q5"
                    checked={formData.q5_knowsRecycler === opt}
                    onChange={() => handleRadioChange('q5_knowsRecycler', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q6 */}
          <div>
            <label className="form-label" style={{ fontSize: '0.98rem' }}>
              6. What is the main difficulty you face while disposing of e-waste? <span className="required">*</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
              {[
                "Don't know where to dispose of it",
                'No nearby collection point',
                "Don't know any recycler",
                'Pickup is not available',
                'Inconvenient collection timings',
                'No difficulty'
              ].map((opt) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="q6"
                    checked={formData.q6_mainDifficulty === opt}
                    onChange={() => handleRadioChange('q6_mainDifficulty', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q7 */}
          <div>
            <label className="form-label" style={{ fontSize: '0.98rem' }}>
              7. Which method would you prefer? <span className="required">*</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
              {[
                'Doorstep pickup',
                'Nearby pickup point',
                'Community collection drive',
                'Any convenient option'
              ].map((opt) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="q7"
                    checked={formData.q7_preferredMethod === opt}
                    onChange={() => handleRadioChange('q7_preferredMethod', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q8 */}
          <div>
            <label className="form-label" style={{ fontSize: '0.98rem' }}>
              8. Would you use an online platform connecting you with nearby recyclers? <span className="required">*</span>
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              {['Yes', 'No', 'Maybe'].map((opt) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.92rem' }}>
                  <input
                    type="radio"
                    name="q8"
                    checked={formData.q8_wouldUsePlatform === opt}
                    onChange={() => handleRadioChange('q8_wouldUsePlatform', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q9 */}
          <div>
            <label className="form-label" style={{ fontSize: '0.98rem' }}>
              9. Which features would be most useful? (Select all that apply) <span className="required">*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.6rem', marginTop: '0.5rem' }}>
              {[
                'Find nearby recyclers/collection points',
                'Select pickup date and time',
                'Submit e-waste details',
                'Track collection request',
                'View recycler/collector information'
              ].map((item) => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.q9_usefulFeatures.includes(item)}
                    onChange={() => handleCheckboxChange('q9_usefulFeatures', item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q10 */}
          <div>
            <label className="form-label" style={{ fontSize: '0.98rem' }}>
              10. Would you participate in a community e-waste collection initiative? <span className="required">*</span>
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              {['Yes', 'No', 'Maybe'].map((opt) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.92rem' }}>
                  <input
                    type="radio"
                    name="q10"
                    checked={formData.q10_willingToParticipate === opt}
                    onChange={() => handleRadioChange('q10_willingToParticipate', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Feedback comments */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              Any Additional Suggestions or Ideas for Community Recycling?
            </label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Share thoughts on kiosk locations, awareness ideas, or college initiatives..."
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <Send size={18} />
            {submitting ? 'Submitting Responses to Database...' : 'Submit Survey Responses'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommunitySurveyPage;
