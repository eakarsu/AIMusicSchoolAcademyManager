import React, { useState, useEffect } from 'react';
import { FaRedo } from 'react-icons/fa';
import api from '../api';
import AIOutput from '../components/AIOutput';

export default function AIScheduleMakeup() {
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [lessonId, setLessonId] = useState('');
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

  useEffect(() => {
    if (!studentId) { setLessons([]); setLessonId(''); return; }
    api.get(`/lessons?page=1&limit=100`).then(res => {
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setLessons(data.filter(l => String(l.student_id) === String(studentId)));
      setLessonId('');
    }).catch(() => setLessons([]));
  }, [studentId]);

  const generate = async () => {
    if (!studentId || !lessonId) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/ai/schedule-makeup', {
        studentId: Number(studentId),
        lessonId: Number(lessonId),
      });
      setResult(res.data);
      setTimestamp(new Date().toISOString());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to schedule makeup lesson');
    }
    setLoading(false);
  };

  const selectedStudent = students.find(s => String(s.id) === String(studentId));
  const structured = result?.structured;

  return (
    <div className="ai-page">
      <h1><FaRedo /> Makeup Lesson Scheduler</h1>

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
          <div className="form-group">
            <label>Select Lesson to Make Up</label>
            <select className="form-select" value={lessonId} onChange={e => setLessonId(e.target.value)} disabled={!studentId}>
              <option value="">Choose a lesson...</option>
              {lessons.map(l => (
                <option key={l.id} value={l.id}>
                  {l.day_of_week} {l.start_time} - {l.instrument || 'Lesson'} (ID: {l.id})
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary btn-lg" onClick={generate} disabled={!studentId || !lessonId || loading}>
            {loading ? 'Scheduling...' : 'Find Makeup Slots'}
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Finding available makeup slots...</div>
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
            </div>
          </div>

          {structured && (
            <div className="ai-output-card" style={{ marginBottom: 16 }}>
              {structured.recommended_slot && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ color: '#a5b4fc', marginBottom: 8, fontSize: 15 }}>Recommended Slot</h4>
                  <div style={{
                    padding: 16, background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.4)', borderRadius: 10
                  }}>
                    <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>
                      {structured.recommended_slot.date || structured.recommended_slot.day_of_week} at {structured.recommended_slot.time || structured.recommended_slot.start_time}
                    </div>
                    {structured.recommended_slot.duration_minutes && (
                      <div style={{ color: '#94a3b8', fontSize: 13 }}>{structured.recommended_slot.duration_minutes} minutes</div>
                    )}
                    {(structured.recommended_slot.end_time) && (
                      <div style={{ color: '#94a3b8', fontSize: 13 }}>Until {structured.recommended_slot.end_time}</div>
                    )}
                    {structured.reasoning && (
                      <div style={{ marginTop: 8, color: '#94a3b8', fontSize: 13, fontStyle: 'italic' }}>
                        {structured.reasoning}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {structured.available_slots?.length > 0 && (
                <div>
                  <h4 style={{ color: '#a5b4fc', marginBottom: 8, fontSize: 15 }}>All Available Slots</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                    {structured.available_slots.map((slot, i) => (
                      <div key={i} style={{
                        padding: 12, background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8
                      }}>
                        <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}>
                          {slot.date || slot.day_of_week || slot.day}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: 13 }}>
                          {slot.time || slot.start_time}{slot.end_time ? ` - ${slot.end_time}` : ''}{slot.duration_minutes ? ` (${slot.duration_minutes} min)` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.makeup_lesson?.id && (
                <div style={{ marginTop: 16, padding: 12, background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.3)', borderRadius: 8, color: '#27ae60', fontSize: 14 }}>
                  Makeup lesson scheduled (ID: {result.makeup_lesson.id})
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
