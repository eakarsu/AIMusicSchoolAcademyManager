import React, { useState } from 'react';
import { FaBullhorn } from 'react-icons/fa';
import api from '../api';
import AIOutput from '../components/AIOutput';

export default function AIEventPromotion() {
  const [form, setForm] = useState({
    eventName: '',
    eventType: 'recital',
    audience: 'parents and community',
    channels: 'email, social, flyers',
    eventDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!form.eventName.trim()) { setError('Event name required'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const body = {
        eventName: form.eventName,
        eventType: form.eventType,
        audience: form.audience,
        channels: form.channels.split(',').map(s => s.trim()).filter(Boolean),
        eventDate: form.eventDate,
      };
      const res = await api.post('/ai/event-promotion', body);
      setResult(res.data);
      setTimestamp(new Date().toISOString());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate promotion plan');
    }
    setLoading(false);
  };

  return (
    <div className="ai-page">
      <h1><FaBullhorn /> Event Promotion Plan</h1>

      <div className="ai-form-card">
        <div className="form-row">
          <div className="form-group">
            <label>Event Name</label>
            <input className="form-select" value={form.eventName}
              onChange={e => setForm(f => ({ ...f, eventName: e.target.value }))}
              placeholder="e.g., Spring Recital 2026" />
          </div>
          <div className="form-group">
            <label>Event Type</label>
            <select className="form-select" value={form.eventType}
              onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))}>
              <option value="recital">Recital</option>
              <option value="competition">Competition</option>
              <option value="workshop">Workshop</option>
              <option value="open-house">Open House</option>
              <option value="summer-camp">Summer Camp</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Audience</label>
            <input className="form-select" value={form.audience}
              onChange={e => setForm(f => ({ ...f, audience: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Channels (comma separated)</label>
            <input className="form-select" value={form.channels}
              onChange={e => setForm(f => ({ ...f, channels: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Event Date</label>
            <input type="date" className="form-select" value={form.eventDate}
              onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} />
          </div>
        </div>
        <div className="form-row">
          <button className="btn btn-primary btn-lg" onClick={generate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Promotion Plan'}
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Creating multi-channel promotion plan...</div>
        </div>
      )}

      {result && (
        <AIOutput content={result} timestamp={timestamp} onRegenerate={generate} />
      )}
    </div>
  );
}
