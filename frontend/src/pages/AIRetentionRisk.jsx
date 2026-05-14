import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import api from '../api';
import AIOutput from '../components/AIOutput';

export default function AIRetentionRisk() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
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
      if (studentId) body.studentId = Number(studentId);
      const res = await api.post('/ai/retention-risk', body);
      setResult(res.data);
      setTimestamp(new Date().toISOString());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate retention risk analysis');
    }
    setLoading(false);
  };

  return (
    <div className="ai-page">
      <h1><FaExclamationTriangle /> Retention Risk Analysis</h1>

      <div className="ai-form-card">
        <div className="form-row">
          <div className="form-group">
            <label>Specific Student (Optional)</label>
            <select className="form-select" value={studentId} onChange={e => setStudentId(e.target.value)}>
              <option value="">All students (cohort analysis)</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.first_name} {s.last_name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary btn-lg" onClick={generate} disabled={loading}>
            {loading ? 'Analyzing...' : 'Run Risk Analysis'}
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Identifying at-risk students...</div>
        </div>
      )}

      {result && (
        <AIOutput content={result} timestamp={timestamp} onRegenerate={generate} />
      )}
    </div>
  );
}
