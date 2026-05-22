import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import api from '../api';

export default function StudentProgressChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/custom-views/student-progress')
      .then(r => setData(r.data))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading progress chart…</div>;
  if (err) return <div style={{ padding: 20, color: 'crimson' }}>Error: {err}</div>;
  if (!data) return null;

  const { combined, series } = data;

  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
      <h3 style={{ margin: '0 0 4px 0', color: '#7c3aed' }}>Student Progress Over Time</h3>
      <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: 13 }}>
        Skill grade (0-100) tracked monthly per student
      </p>
      <div style={{ width: '100%', height: 360 }}>
        <ResponsiveContainer>
          <LineChart data={combined} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis domain={[40, 100]} stroke="#6b7280" />
            <Tooltip />
            <Legend />
            {series.map(s => (
              <Line
                key={s.studentId}
                type="monotone"
                dataKey={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
        {series.map(s => {
          const first = s.points[0].grade;
          const last = s.points[s.points.length - 1].grade;
          const delta = last - first;
          return (
            <div key={s.studentId} style={{ border: '1px solid #e5e7eb', padding: 10, borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                <span style={{ width: 10, height: 10, background: s.color, borderRadius: '50%' }} />
                {s.name}
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{s.instrument}</div>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Current: <b>{last}</b>{' '}
                <span style={{ color: delta >= 0 ? '#10b981' : '#ef4444' }}>
                  ({delta >= 0 ? '+' : ''}{delta})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
