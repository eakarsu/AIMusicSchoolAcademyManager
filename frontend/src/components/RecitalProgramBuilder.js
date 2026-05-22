import React, { useEffect, useState } from 'react';
import api from '../api';

export default function RecitalProgramBuilder() {
  const [students, setStudents] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('Spring Recital 2026');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [venue, setVenue] = useState('Main Auditorium');
  const [items, setItems] = useState([]); // [{studentId, pieceId}]
  const [pdfUrl, setPdfUrl] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/custom-views/recital-options')
      .then(r => { setStudents(r.data.students); setPieces(r.data.pieces); })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const addItem = (studentId, pieceId) => {
    setItems([...items, { studentId, pieceId }]);
  };
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const move = (idx, dir) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= items.length) return;
    const cp = items.slice();
    [cp[idx], cp[ni]] = [cp[ni], cp[idx]];
    setItems(cp);
  };

  const onDragStart = (idx, e) => {
    e.dataTransfer.setData('text/plain', String(idx));
  };
  const onDrop = (idx, e) => {
    const from = parseInt(e.dataTransfer.getData('text/plain'));
    if (isNaN(from) || from === idx) return;
    const cp = items.slice();
    const [moved] = cp.splice(from, 1);
    cp.splice(idx, 0, moved);
    setItems(cp);
  };

  const generate = async () => {
    setBusy(true);
    setErr('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/custom-views/recital-program-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, date, venue, items }),
      });
      if (!res.ok) throw new Error('Failed to generate PDF (' + res.status + ')');
      const blob = await res.blob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading recital options…</div>;

  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
      <h3 style={{ margin: '0 0 4px 0', color: '#7c3aed' }}>Recital Program Builder</h3>
      <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: 13 }}>
        Add students with pieces, drag rows to reorder the program, then export the printable PDF.
      </p>
      {err && <div style={{ color: 'crimson', marginBottom: 10 }}>Error: {err}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={lab}>Program title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} style={inp} />
        </div>
        <div>
          <label style={lab}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} />
        </div>
        <div>
          <label style={lab}>Venue</label>
          <input value={venue} onChange={e => setVenue(e.target.value)} style={inp} />
        </div>
      </div>

      <AddItemBar students={students} pieces={pieces} onAdd={addItem} />

      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 600, color: '#374151', marginBottom: 6 }}>
          Program order ({items.length} item{items.length === 1 ? '' : 's'}) — drag to reorder
        </div>
        {items.length === 0 && <div style={{ color: '#9ca3af', fontSize: 13 }}>No performances yet.</div>}
        {items.map((it, idx) => {
          const s = students.find(x => x.id === it.studentId);
          const p = pieces.find(x => x.id === it.pieceId);
          return (
            <div
              key={idx}
              draggable
              onDragStart={(e) => onDragStart(idx, e)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(idx, e)}
              style={row}
            >
              <span style={{ width: 24, color: '#6b7280', fontWeight: 700 }}>{idx + 1}.</span>
              <span style={{ flex: 1 }}>
                <b>{p?.title}</b> <span style={{ color: '#6b7280' }}>by {p?.composer}</span> —{' '}
                {s?.name} <span style={{ color: '#6b7280' }}>({s?.instrument})</span>
              </span>
              <button onClick={() => move(idx, -1)} style={smBtn}>↑</button>
              <button onClick={() => move(idx, 1)} style={smBtn}>↓</button>
              <button onClick={() => removeItem(idx)} style={{ ...smBtn, background: '#ef4444', color: '#fff' }}>×</button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
        <button onClick={generate} disabled={busy || items.length === 0} style={btn}>
          {busy ? 'Generating…' : 'Generate Program PDF'}
        </button>
        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noreferrer" download="recital_program.pdf" style={{ ...btn, background: '#10b981', textDecoration: 'none' }}>
            Download PDF
          </a>
        )}
      </div>

      {pdfUrl && (
        <div style={{ marginTop: 16, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
          <iframe src={pdfUrl} title="Program preview" style={{ width: '100%', height: 480, border: 'none' }} />
        </div>
      )}
    </div>
  );
}

function AddItemBar({ students, pieces, onAdd }) {
  const [sId, setSId] = useState(students[0]?.id || '');
  const [pId, setPId] = useState(pieces[0]?.id || '');
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'end', flexWrap: 'wrap', padding: 10, background: '#f9fafb', borderRadius: 8 }}>
      <div>
        <label style={lab}>Student</label>
        <select value={sId} onChange={e => setSId(parseInt(e.target.value))} style={inp}>
          {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.instrument})</option>)}
        </select>
      </div>
      <div>
        <label style={lab}>Piece</label>
        <select value={pId} onChange={e => setPId(parseInt(e.target.value))} style={inp}>
          {pieces.map(p => <option key={p.id} value={p.id}>{p.title} — {p.composer}</option>)}
        </select>
      </div>
      <button onClick={() => onAdd(sId, pId)} style={btn}>+ Add to program</button>
    </div>
  );
}

const lab = { display: 'block', fontSize: 12, color: '#374151', marginBottom: 4, fontWeight: 600 };
const inp = { padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, minWidth: 200, fontSize: 13 };
const btn = { padding: '9px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 };
const smBtn = { padding: '4px 10px', background: '#e5e7eb', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 };
const row = { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 6, marginBottom: 6, background: '#fff' };
