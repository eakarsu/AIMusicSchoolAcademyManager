import React, { useState, useEffect } from 'react';
import { FaClipboardList } from 'react-icons/fa';
import api from '../api';
import AIOutput from '../components/AIOutput';

export default function AILessonPlan() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/students').then(res => {
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setStudents(data);
    }).catch(() => setStudents([]));

    api.get('/teachers').then(res => {
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setTeachers(data);
    }).catch(() => setTeachers([]));
  }, []);

  const generate = async () => {
    if (!studentId) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const body = { student_id: Number(studentId) };
      if (teacherId) body.teacher_id = Number(teacherId);
      const res = await api.post('/ai/lesson-plan', body);
      setResult(res.data);
      setTimestamp(new Date().toISOString());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate lesson plan');
    }
    setLoading(false);
  };

  return (
    <div className="ai-page">
      <h1><FaClipboardList /> Lesson Plan Suggestions</h1>

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
            <label>Select Teacher (Optional)</label>
            <select className="form-select" value={teacherId} onChange={e => setTeacherId(e.target.value)}>
              <option value="">Any teacher...</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.first_name} {t.last_name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary btn-lg" onClick={generate} disabled={!studentId || loading}>
            {loading ? 'Generating...' : 'Generate Lesson Plan'}
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Creating lesson plan suggestions...</div>
        </div>
      )}

      {result && (
        <AIOutput content={result} timestamp={timestamp} onRegenerate={generate} />
      )}
    </div>
  );
}
