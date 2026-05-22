import React, { useEffect, useState } from 'react';
import api from '../api';

export default function InvoicePDF() {
  const [students, setStudents] = useState([]);
  const [months, setMonths] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/custom-views/invoice-options')
      .then(r => {
        setStudents(r.data.students);
        setMonths(r.data.months);
        if (r.data.students.length) setStudentId(String(r.data.students[0].id));
        if (r.data.months.length) setMonth(r.data.months[0].value);
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const generate = async () => {
    if (!studentId || !month) return;
    setBusy(true);
    setErr('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/custom-views/invoice-pdf?studentId=${studentId}&month=${month}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to generate PDF (' + res.status + ')');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading invoice options…</div>;

  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
      <h3 style={{ margin: '0 0 4px 0', color: '#7c3aed' }}>Invoice PDF Generator</h3>
      <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: 13 }}>
        Select a student and month, generate a PDF showing lessons, hours, rate and total.
      </p>
      {err && <div style={{ color: 'crimson', marginBottom: 10 }}>Error: {err}</div>}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'end' }}>
        <div>
          <label style={lab}>Student</label>
          <select value={studentId} onChange={e => setStudentId(e.target.value)} style={inp}>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.instrument})</option>)}
          </select>
        </div>
        <div>
          <label style={lab}>Month</label>
          <select value={month} onChange={e => setMonth(e.target.value)} style={inp}>
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <button onClick={generate} disabled={busy} style={btn}>
          {busy ? 'Generating…' : 'Generate Invoice PDF'}
        </button>
        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noreferrer" download={`invoice_${studentId}_${month}.pdf`} style={{ ...btn, background: '#10b981', textDecoration: 'none' }}>
            Download PDF
          </a>
        )}
      </div>
      {pdfUrl && (
        <div style={{ marginTop: 16, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
          <iframe src={pdfUrl} title="Invoice preview" style={{ width: '100%', height: 500, border: 'none' }} />
        </div>
      )}
    </div>
  );
}

const lab = { display: 'block', fontSize: 12, color: '#374151', marginBottom: 4, fontWeight: 600 };
const inp = { padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, minWidth: 220, fontSize: 13 };
const btn = { padding: '9px 16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 };
