import React, { useState, useEffect } from 'react';
import { FaRobot } from 'react-icons/fa';
import api from '../api';
import AIOutput from '../components/AIOutput';

function WeeklyCalendar({ weekPlan }) {
  if (!weekPlan || !Array.isArray(weekPlan)) return null;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ marginBottom: 12, fontSize: 16 }}>Weekly Practice Calendar</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {weekPlan.map((day, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: 14,
            borderTop: '3px solid var(--primary, #6366f1)'
          }}>
            <div style={{ fontWeight: 700, marginBottom: 8, color: '#a5b4fc', fontSize: 14 }}>
              {day.day || days[i] || `Day ${i + 1}`}
            </div>
            {day.exercises && day.exercises.map((ex, j) => (
              <div key={j} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: j < day.exercises.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{ex.piece || ex.exercise || `Exercise ${j + 1}`}</div>
                {ex.duration_minutes && <div style={{ fontSize: 11, color: '#94a3b8' }}>{ex.duration_minutes} min</div>}
                {ex.focus_area && <div style={{ fontSize: 11, color: '#64748b' }}>{ex.focus_area}</div>}
                {ex.technique_notes && <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>{ex.technique_notes}</div>}
              </div>
            ))}
            {day.total_minutes && (
              <div style={{ marginTop: 4, fontSize: 12, color: '#6366f1', fontWeight: 600 }}>
                Total: {day.total_minutes} min
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AIPracticePlan() {
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
      const res = await api.post('/ai/practice-plan', { studentId: Number(studentId) });
      setResult(res.data);
      setTimestamp(new Date().toISOString());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate practice plan');
    }
    setLoading(false);
  };

  const selectedStudent = students.find(s => String(s.id) === String(studentId));

  return (
    <div className="ai-page">
      <h1><FaRobot /> Practice Plan Generator</h1>

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
            {loading ? 'Generating...' : 'Generate Practice Plan'}
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Generating personalized practice plan...</div>
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
            </div>
          </div>

          {result.structured?.week_plan && (
            <div className="ai-output-card" style={{ marginBottom: 16 }}>
              <WeeklyCalendar weekPlan={result.structured.week_plan} />
              {result.structured.goals?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h4 style={{ marginBottom: 8, fontSize: 14, color: '#a5b4fc' }}>Goals</h4>
                  <ul style={{ paddingLeft: 20, color: '#e2e8f0', fontSize: 13 }}>
                    {result.structured.goals.map((g, i) => <li key={i}>{g}</li>)}
                  </ul>
                </div>
              )}
              {result.structured.parent_notes && (
                <div style={{ marginTop: 12, padding: 12, background: 'rgba(99,102,241,0.08)', borderRadius: 8, fontSize: 13, color: '#94a3b8' }}>
                  <strong style={{ color: '#a5b4fc' }}>Parent Notes:</strong> {result.structured.parent_notes}
                </div>
              )}
            </div>
          )}

          <AIOutput content={result} timestamp={timestamp} onRegenerate={generate} />
        </>
      )}
    </div>
  );
}
