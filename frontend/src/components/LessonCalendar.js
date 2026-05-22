import React, { useEffect, useState } from 'react';
import api from '../api';

export default function LessonCalendar() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/custom-views/lesson-calendar')
      .then(r => setData(r.data))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading lesson calendar…</div>;
  if (err) return <div style={{ padding: 20, color: 'crimson' }}>Error: {err}</div>;
  if (!data) return null;

  const { days, timeSlots, lessons, instruments, totalLessons } = data;

  const lessonAt = (day, time) =>
    lessons.find(l => l.day === day && l.time === time);

  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0, color: '#7c3aed' }}>Weekly Lesson Calendar</h3>
          <p style={{ margin: '4px 0 12px 0', color: '#6b7280', fontSize: 13 }}>
            {totalLessons} lessons scheduled this week
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 460, justifyContent: 'flex-end' }}>
          {instruments.map(i => (
            <div key={i.name} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
              <span style={{ width: 12, height: 12, background: i.color, borderRadius: 3, display: 'inline-block' }} />
              {i.name}
            </div>
          ))}
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
          <thead>
            <tr>
              <th style={th}>Time</th>
              {days.map(d => <th key={d} style={th}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time}>
                <td style={{ ...td, fontWeight: 600, color: '#374151', width: 70 }}>{time}</td>
                {days.map(day => {
                  const lesson = lessonAt(day, time);
                  return (
                    <td key={day + time} style={td}>
                      {lesson ? (
                        <div style={{
                          background: lesson.color,
                          color: '#fff',
                          padding: '6px 8px',
                          borderRadius: 6,
                          fontSize: 11,
                          lineHeight: 1.3,
                        }}>
                          <div style={{ fontWeight: 700 }}>{lesson.student}</div>
                          <div style={{ opacity: 0.9 }}>{lesson.teacher}</div>
                          <div style={{ opacity: 0.85, fontStyle: 'italic' }}>{lesson.instrument}</div>
                        </div>
                      ) : (
                        <div style={{ minHeight: 30 }} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = { textAlign: 'left', borderBottom: '2px solid #e5e7eb', padding: '8px 6px', background: '#f9fafb', color: '#374151', fontSize: 12 };
const td = { borderBottom: '1px solid #f3f4f6', padding: '6px', verticalAlign: 'top' };
