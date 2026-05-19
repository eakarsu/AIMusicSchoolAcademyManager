import React, { useState, useEffect } from 'react';
import { FaMusic } from 'react-icons/fa';
import api from '../api';
import AIOutput from '../components/AIOutput';

export default function AIParentSummary() {
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
    if (!studentId) {
      setError('Choose a student');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/ai/parent-summary', { studentId: Number(studentId) });
      setResult(res.data);
      setTimestamp(new Date().toISOString());
    } catch (err) {
      if (err.response?.status === 503) {
        setError('AI service is not configured. Please set OPENROUTER_API_KEY.');
      } else {
        setError(err.response?.data?.error || 'Failed to generate parent summary');
      }
    }
    setLoading(false);
  };

  return (
    <div className="ai-page">
      <h1><FaMusic /> Parent Portal Digest</h1>

      <div className="ai-form-card">
        <div className="form-row">
          <div className="form-group">
            <label>Student</label>
            <select className="form-select" value={studentId} onChange={e => setStudentId(e.target.value)}>
              <option value="">-- choose --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.first_name} {s.last_name} {s.instrument ? `- ${s.instrument}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <button className="btn btn-primary btn-lg" onClick={generate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Digest'}
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Compiling 30-day digest...</div>
        </div>
      )}
      {result && <AIOutput content={result} timestamp={timestamp} onRegenerate={generate} />}
    </div>
  );
}
