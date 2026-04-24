import React, { useState, useEffect } from 'react';
import { FaLightbulb } from 'react-icons/fa';
import api from '../api';
import AIOutput from '../components/AIOutput';

export default function AISkillAssessment() {
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
      const res = await api.post('/ai/skill-assessment', { student_id: Number(studentId) });
      setResult(res.data);
      setTimestamp(new Date().toISOString());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate skill assessment');
    }
    setLoading(false);
  };

  const selectedStudent = students.find(s => String(s.id) === String(studentId));

  return (
    <div className="ai-page">
      <h1><FaLightbulb /> Skill Assessment</h1>

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
            {loading ? 'Generating...' : 'Generate Assessment'}
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Analyzing student skills...</div>
        </div>
      )}

      {selectedStudent && result && (
        <>
          <div className="ai-form-card" style={{ marginBottom: 16 }}>
            <div className="detail-grid">
              <div className="detail-field">
                <div className="detail-label">Student</div>
                <div className="detail-value">{selectedStudent.first_name} {selectedStudent.last_name}</div>
              </div>
              <div className="detail-field">
                <div className="detail-label">Instrument</div>
                <div className="detail-value">{selectedStudent.instrument || '-'}</div>
              </div>
              <div className="detail-field">
                <div className="detail-label">Level</div>
                <div className="detail-value">{selectedStudent.level || '-'}</div>
              </div>
              <div className="detail-field">
                <div className="detail-label">Status</div>
                <div className="detail-value">{selectedStudent.status || '-'}</div>
              </div>
            </div>
          </div>
          <AIOutput content={result} timestamp={timestamp} onRegenerate={generate} />
        </>
      )}
    </div>
  );
}
