import React, { useState, useEffect } from 'react';
import { FaBrain } from 'react-icons/fa';
import api from '../api';
import AIOutput from '../components/AIOutput';

const GRADE_COLORS = { A: '#27ae60', B: '#2980b9', C: '#f39c12', D: '#e67e22', F: '#e74c3c' };

function SkillScoreChart({ skillScores }) {
  if (!skillScores || !Array.isArray(skillScores) || skillScores.length === 0) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ marginBottom: 12, fontSize: 15, color: '#a5b4fc' }}>Skill Scores</h4>
      {skillScores.map((s, i) => {
        const score = s.score || 0;
        const color = score >= 80 ? '#27ae60' : score >= 60 ? '#f39c12' : '#e74c3c';
        return (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
              <span style={{ color: '#e2e8f0' }}>{s.skill}</span>
              <span style={{ color, fontWeight: 700 }}>{score}/100</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, score)}%`, height: '100%',
                background: `linear-gradient(90deg, ${color}aa, ${color})`,
                borderRadius: 4,
                transition: 'width 0.6s ease'
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AIProgressReport() {
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
      const res = await api.post('/ai/progress-report', { studentId: Number(studentId) });
      setResult(res.data);
      setTimestamp(new Date().toISOString());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate progress report');
    }
    setLoading(false);
  };

  const selectedStudent = students.find(s => String(s.id) === String(studentId));
  const structured = result?.structured;

  return (
    <div className="ai-page">
      <h1><FaBrain /> Progress Report Writer</h1>

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
            {loading ? 'Generating...' : 'Generate Progress Report'}
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Writing progress report...</div>
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

          {structured && (
            <div className="ai-output-card" style={{ marginBottom: 16 }}>
              {/* Overall grade badge */}
              {structured.overall_grade && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${GRADE_COLORS[structured.overall_grade] || '#6366f1'}20`,
                    border: `3px solid ${GRADE_COLORS[structured.overall_grade] || '#6366f1'}`,
                    fontSize: 28, fontWeight: 700,
                    color: GRADE_COLORS[structured.overall_grade] || '#6366f1'
                  }}>
                    {structured.overall_grade}
                  </div>
                  <div>
                    <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 18 }}>Overall Grade</div>
                    {structured.ready_for_advancement !== undefined && (
                      <div style={{ fontSize: 13, color: structured.ready_for_advancement ? '#27ae60' : '#f39c12' }}>
                        {structured.ready_for_advancement ? '✓ Ready for advancement' : '→ Continuing at current level'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <SkillScoreChart skillScores={structured.skill_scores} />

              {structured.strengths?.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <h4 style={{ color: '#27ae60', marginBottom: 6, fontSize: 14 }}>Strengths</h4>
                  <ul style={{ paddingLeft: 20, color: '#e2e8f0', fontSize: 13 }}>
                    {structured.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}

              {structured.improvement_areas?.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <h4 style={{ color: '#f39c12', marginBottom: 6, fontSize: 14 }}>Areas for Improvement</h4>
                  <ul style={{ paddingLeft: 20, color: '#e2e8f0', fontSize: 13 }}>
                    {structured.improvement_areas.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}

              {structured.teacher_recommendation && (
                <div style={{ padding: 12, background: 'rgba(99,102,241,0.08)', borderRadius: 8, fontSize: 13, color: '#94a3b8' }}>
                  <strong style={{ color: '#a5b4fc' }}>Teacher Recommendation:</strong> {structured.teacher_recommendation}
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
