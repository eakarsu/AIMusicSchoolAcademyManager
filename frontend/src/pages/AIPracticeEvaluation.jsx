import React, { useState, useEffect } from 'react';
import { FaMusic } from 'react-icons/fa';
import api from '../api';
import AIOutput from '../components/AIOutput';

export default function AIPracticeEvaluation() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [piece, setPiece] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [transcript, setTranscript] = useState('');
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
      if (piece) body.piece = piece;
      if (duration) body.duration_minutes = Number(duration);
      if (notes) body.notes = notes;
      if (transcript) body.recording_transcript = transcript;
      const res = await api.post('/ai/practice-evaluation', body);
      setResult(res.data);
      setTimestamp(new Date().toISOString());
    } catch (err) {
      if (err.response?.status === 503) {
        setError('AI service is not configured. Please set OPENROUTER_API_KEY.');
      } else {
        setError(err.response?.data?.error || 'Failed to evaluate practice');
      }
    }
    setLoading(false);
  };

  return (
    <div className="ai-page">
      <h1><FaMusic /> Practice Evaluation</h1>
      <p style={{ color: '#666', marginTop: -8 }}>
        Self-reported / transcribed practice session feedback. (Vision/audio upload not yet wired.)
      </p>

      <div className="ai-form-card">
        <div className="form-row">
          <div className="form-group">
            <label>Student</label>
            <select className="form-select" value={studentId} onChange={e => setStudentId(e.target.value)}>
              <option value="">-- optional --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.first_name} {s.last_name} {s.instrument ? `- ${s.instrument}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Piece</label>
            <input className="form-input" value={piece} onChange={e => setPiece(e.target.value)} placeholder="e.g. Bach Minuet in G" />
          </div>
          <div className="form-group">
            <label>Duration (min)</label>
            <input type="number" className="form-input" value={duration} onChange={e => setDuration(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ width: '100%' }}>
            <label>Notes</label>
            <textarea className="form-input" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="What did you work on? Where did you struggle?" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ width: '100%' }}>
            <label>Recording Transcript (optional)</label>
            <textarea className="form-input" rows={3} value={transcript} onChange={e => setTranscript(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <button className="btn btn-primary btn-lg" onClick={generate} disabled={loading}>
            {loading ? 'Evaluating...' : 'Evaluate Practice'}
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Evaluating practice session...</div>
        </div>
      )}
      {result && <AIOutput content={result} timestamp={timestamp} onRegenerate={generate} />}
    </div>
  );
}
