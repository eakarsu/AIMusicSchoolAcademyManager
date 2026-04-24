import React, { useState } from 'react';
import { FaBullhorn } from 'react-icons/fa';
import api from '../api';
import AIOutput from '../components/AIOutput';

export default function AIMarketingCampaign() {
  const [campaignType, setCampaignType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!campaignType || !targetAudience) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/ai/marketing-campaign', {
        campaign_type: campaignType,
        target_audience: targetAudience,
        notes: notes,
      });
      setResult(res.data);
      setTimestamp(new Date().toISOString());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate campaign');
    }
    setLoading(false);
  };

  return (
    <div className="ai-page">
      <h1><FaBullhorn /> Marketing Campaign Generator</h1>

      <div className="ai-form-card">
        <div className="form-row">
          <div className="form-group">
            <label>Campaign Type</label>
            <select className="form-select" value={campaignType} onChange={e => setCampaignType(e.target.value)}>
              <option value="">Select type...</option>
              <option value="Social Media">Social Media</option>
              <option value="Email Newsletter">Email Newsletter</option>
              <option value="Flyer">Flyer</option>
              <option value="Website Banner">Website Banner</option>
              <option value="Open House Event">Open House Event</option>
            </select>
          </div>
          <div className="form-group">
            <label>Target Audience</label>
            <select className="form-select" value={targetAudience} onChange={e => setTargetAudience(e.target.value)}>
              <option value="">Select audience...</option>
              <option value="Young Children (4-7)">Young Children (4-7)</option>
              <option value="Children (8-12)">Children (8-12)</option>
              <option value="Teenagers">Teenagers</option>
              <option value="Adults">Adults</option>
              <option value="Seniors">Seniors</option>
              <option value="All Ages">All Ages</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <div className="form-group" style={{ width: '100%' }}>
            <label>Additional Notes (Optional)</label>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any specific details, promotions, themes..."
            />
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-primary btn-lg" onClick={generate} disabled={!campaignType || !targetAudience || loading}>
            {loading ? 'Generating...' : 'Generate Campaign'}
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Creating marketing campaign content...</div>
        </div>
      )}

      {result && (
        <AIOutput content={result} timestamp={timestamp} onRegenerate={generate} />
      )}
    </div>
  );
}
