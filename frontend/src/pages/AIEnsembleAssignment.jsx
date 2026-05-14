import React, { useState, useEffect } from 'react';
import { FaMusic } from 'react-icons/fa';
import api from '../api';
import AIOutput from '../components/AIOutput';

export default function AIEnsembleAssignment() {
  const [ensembles, setEnsembles] = useState([]);
  const [students, setStudents] = useState([]);
  const [ensembleId, setEnsembleId] = useState('');
  const [candidateIds, setCandidateIds] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/ensembles').then(res => {
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setEnsembles(data);
    }).catch(() => setEnsembles([]));
    api.get('/students').then(res => {
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setStudents(data);
    }).catch(() => setStudents([]));
  }, []);

  const generate = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const body = {};
      if (ensembleId) body.ensembleId = Number(ensembleId);
      const ids = candidateIds.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      if (ids.length > 0) body.candidateStudentIds = ids;
      const res = await api.post('/ai/ensemble-assignment', body);
      setResult(res.data);
      setTimestamp(new Date().toISOString());
    } catch (err) {
      if (err.response?.status === 503) {
        setError('AI service is not configured. Please set OPENROUTER_API_KEY.');
      } else {
        setError(err.response?.data?.error || 'Failed to generate ensemble assignments');
      }
    }
    setLoading(false);
  };

  return (
    <div className="ai-page">
      <h1><FaMusic /> Ensemble Assignment</h1>

      <div className="ai-form-card">
        <div className="form-row">
          <div className="form-group">
            <label>Ensemble (optional)</label>
            <select className="form-select" value={ensembleId} onChange={e => setEnsembleId(e.target.value)}>
              <option value="">All active ensembles</option>
              {ensembles.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name} {e.type ? `- ${e.type}` : ''} ({e.current_members || 0}/{e.max_members || '?'})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Candidate Student IDs (optional, comma-separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 1,2,3 (leave blank to consider all)"
              value={candidateIds}
              onChange={e => setCandidateIds(e.target.value)}
            />
            <small style={{ color: '#666' }}>Available students: {students.length}</small>
          </div>
        </div>
        <div className="form-row">
          <button className="btn btn-primary btn-lg" onClick={generate} disabled={loading}>
            {loading ? 'Assigning...' : 'Generate Assignments'}
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Optimizing ensemble placements...</div>
        </div>
      )}

      {result && (
        <AIOutput content={result} timestamp={timestamp} onRegenerate={generate} />
      )}
    </div>
  );
}
