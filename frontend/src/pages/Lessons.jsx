import React, { useState } from 'react';
import api from '../api';

const columns = [
  { key: 'student_first_name', label: 'Student' },
  { key: 'teacher_first_name', label: 'Teacher' },
  { key: 'instrument', label: 'Instrument' },
  { key: 'lesson_type', label: 'Type' },
  { key: 'day_of_week', label: 'Day' },
  { key: 'start_time', label: 'Time' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'student_id', label: 'Student ID', type: 'number', required: true },
  { key: 'teacher_id', label: 'Teacher ID', type: 'number', required: true },
  { key: 'instrument', label: 'Instrument', type: 'text' },
  { key: 'lesson_type', label: 'Lesson Type', type: 'select', options: ['Private','Group','Online'] },
  { key: 'day_of_week', label: 'Day of Week', type: 'select', options: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
  { key: 'start_time', label: 'Start Time', type: 'time' },
  { key: 'end_time', label: 'End Time', type: 'time' },
  { key: 'duration', label: 'Duration (min)', type: 'number' },
  { key: 'room_id', label: 'Room ID', type: 'number' },
  { key: 'price', label: 'Price', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active','Cancelled','Completed'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function ConflictModal({ conflict, onClose, onProceed }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h3 style={{ color: '#f39c12' }}>⚠ Scheduling Conflict</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ padding: 16, background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.3)', borderRadius: 8, marginBottom: 16 }}>
            <p style={{ color: '#e2e8f0', marginBottom: 8 }}>{conflict.message}</p>
            {conflict.suggestion && (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>Suggestion: {conflict.suggestion}</p>
            )}
            {conflict.conflicting_lesson_id && (
              <p style={{ color: '#94a3b8', fontSize: 12 }}>Conflicting lesson ID: {conflict.conflicting_lesson_id}</p>
            )}
          </div>
          <p style={{ color: '#94a3b8', fontSize: 13 }}>Please choose a different time slot or teacher/room to avoid the conflict.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Go Back & Fix</button>
        </div>
      </div>
    </div>
  );
}

export default function Lessons() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [conflict, setConflict] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({});
  const [error, setError] = useState('');
  const LIMIT = 50;

  const fetchItems = async (p = page) => {
    setLoading(true);
    try {
      const res = await api.get(`/lessons?page=${p}&limit=${LIMIT}`);
      if (res.data.data) {
        setItems(res.data.data);
        setPagination({ total: res.data.total, totalPages: res.data.totalPages });
      } else {
        setItems(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  React.useEffect(() => { fetchItems(1); }, []);

  const handleCreate = async () => {
    setError('');
    try {
      await api.post('/lessons', createData);
      setShowCreate(false);
      setCreateData({});
      fetchItems(page);
    } catch (err) {
      if (err.response?.status === 409) {
        const conflicts = err.response.data.conflicts;
        if (conflicts?.length > 0) {
          setConflict(conflicts[0]);
          return;
        }
      }
      setError(err.response?.data?.error || err.message);
    }
  };

  const getCellValue = (item, key) => {
    const val = item[key];
    if (val === null || val === undefined || val === '') return '-';
    if (key === 'student_first_name') return `${item.student_first_name || ''} ${item.student_last_name || ''}`.trim() || item.student_id;
    if (key === 'teacher_first_name') return `${item.teacher_first_name || ''} ${item.teacher_last_name || ''}`.trim() || item.teacher_id;
    return String(val);
  };

  const getBadgeClass = (val) => {
    const map = { active: 'badge-active', cancelled: 'badge-cancelled', completed: 'badge-completed' };
    return val ? map[val.toLowerCase()] || '' : '';
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <h1>Lessons <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 400 }}>({pagination.total})</span></h1>
        <div className="feature-actions">
          <button className="btn btn-primary" onClick={() => { setCreateData({}); setShowCreate(true); setError(''); }}>
            + Add Lesson
          </button>
        </div>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner"></div></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>{columns.map(col => <th key={col.key}>{col.label}</th>)}</tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  {columns.map(col => {
                    const val = getCellValue(item, col.key);
                    const badge = col.key === 'status' ? getBadgeClass(val) : '';
                    return (
                      <td key={col.key}>
                        {badge ? <span className={`badge ${badge}`}>{val}</span> : val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
          <button className="btn btn-secondary" onClick={() => { const p = page - 1; setPage(p); fetchItems(p); }} disabled={page <= 1}>← Prev</button>
          <span style={{ color: '#94a3b8', lineHeight: '36px', fontSize: 14 }}>Page {page} of {pagination.totalPages}</span>
          <button className="btn btn-secondary" onClick={() => { const p = page + 1; setPage(p); fetchItems(p); }} disabled={page >= pagination.totalPages}>Next →</button>
        </div>
      )}

      {conflict && (
        <ConflictModal
          conflict={conflict}
          onClose={() => setConflict(null)}
        />
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule New Lesson</h2>
              <button className="modal-close" onClick={() => setShowCreate(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="login-error">{error}</div>}
              <div className="form-grid">
                {formFields.map(field => (
                  <div className={`form-group ${field.type === 'textarea' ? 'full-width' : ''}`} key={field.key}>
                    <label>{field.label}{field.required && <span className="required">*</span>}</label>
                    {field.type === 'select' ? (
                      <select className="form-select" value={createData[field.key] || ''} onChange={e => setCreateData(d => ({ ...d, [field.key]: e.target.value }))}>
                        <option value="">Select...</option>
                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea className="form-textarea" value={createData[field.key] || ''} onChange={e => setCreateData(d => ({ ...d, [field.key]: e.target.value }))} />
                    ) : (
                      <input className="form-input" type={field.type || 'text'} value={createData[field.key] || ''} onChange={e => setCreateData(d => ({ ...d, [field.key]: field.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value }))} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Schedule Lesson</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
