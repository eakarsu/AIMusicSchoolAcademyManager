import React, { useState, useEffect } from 'react';
import { FaMusic } from 'react-icons/fa';
import api from '../api';
import AIOutput from '../components/AIOutput';

export default function AIRecitalProgram() {
  const [recitals, setRecitals] = useState([]);
  const [recitalId, setRecitalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/recitals').then(res => {
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setRecitals(data);
    }).catch(() => setRecitals([]));
  }, []);

  const generate = async () => {
    if (!recitalId) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/ai/recital-program', { recitalId: Number(recitalId) });
      setResult(res.data);
      setTimestamp(new Date().toISOString());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate recital program');
    }
    setLoading(false);
  };

  const selectedRecital = recitals.find(r => String(r.id) === String(recitalId));

  return (
    <div className="ai-page">
      <h1><FaMusic /> Recital Program Creator</h1>

      <div className="ai-form-card">
        <div className="form-row">
          <div className="form-group">
            <label>Select Recital</label>
            <select className="form-select" value={recitalId} onChange={e => setRecitalId(e.target.value)}>
              <option value="">Choose a recital...</option>
              {recitals.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title} {r.date ? `(${r.date})` : ''}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary btn-lg" onClick={generate} disabled={!recitalId || loading}>
            {loading ? 'Generating...' : 'Generate Program'}
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Creating recital program...</div>
        </div>
      )}

      {selectedRecital && result && (
        <>
          <div className="ai-form-card" style={{ marginBottom: 16 }}>
            <div className="detail-grid">
              <div className="detail-field">
                <div className="detail-label">Recital</div>
                <div className="detail-value">{selectedRecital.title}</div>
              </div>
              <div className="detail-field">
                <div className="detail-label">Date</div>
                <div className="detail-value">{selectedRecital.date || '-'}</div>
              </div>
              <div className="detail-field">
                <div className="detail-label">Venue</div>
                <div className="detail-value">{selectedRecital.venue || '-'}</div>
              </div>
              <div className="detail-field">
                <div className="detail-label">Status</div>
                <div className="detail-value">{selectedRecital.status || '-'}</div>
              </div>
            </div>
          </div>
          <AIOutput content={result} timestamp={timestamp} onRegenerate={generate} />
        </>
      )}
    </div>
  );
}
