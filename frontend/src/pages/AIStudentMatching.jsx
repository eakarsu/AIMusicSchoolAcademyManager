import React, { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import api from '../api';
import AIOutput from '../components/AIOutput';

export default function AIStudentMatching() {
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
    if (!studentId) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/ai/student-matching', { studentId: Number(studentId) });
      setResult(res.data);
      setTimestamp(new Date().toISOString());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to match student');
    }
    setLoading(false);
  };

  return (
    <div className="ai-page">
      <h1><FaUsers /> Student-Teacher Matching</h1>

      <div className="ai-form-card">
        <div className="form-row">
          <div className="form-group">
            <label>Select Student</label>
            <select className="form-select" value={studentId} onChange={e => setStudentId(e.target.value)}>
              <option value="">Choose a student...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.first_name} {s.last_name} {s.instrument ? `(${s.instrument})` : ''}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary btn-lg" onClick={generate} disabled={!studentId || loading}>
            {loading ? 'Matching...' : 'Find Best Matches'}
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Ranking instructor matches...</div>
        </div>
      )}

      {result && (
        <AIOutput content={result} timestamp={timestamp} onRegenerate={generate} />
      )}
    </div>
  );
}
