import React, { useState } from 'react';
import LessonCalendar from '../components/LessonCalendar.js';
import StudentProgressChart from '../components/StudentProgressChart.js';
import InvoicePDF from '../components/InvoicePDF.js';
import RecitalProgramBuilder from '../components/RecitalProgramBuilder.js';

const TABS = [
  { key: 'calendar', label: 'Lesson Calendar' },
  { key: 'progress', label: 'Student Progress' },
  { key: 'invoice', label: 'Invoice PDF' },
  { key: 'recital', label: 'Recital Program' },
];

export default function CustomViewsPage() {
  const [tab, setTab] = useState('calendar');

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0, color: '#7c3aed' }}>Academy Views</h1>
        <p style={{ margin: '6px 0 0', color: '#6b7280' }}>
          Custom views for scheduling, progress, billing, and performance planning.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, borderBottom: '1px solid #e5e7eb' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            data-testid={`tab-${t.key}`}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: 600,
              color: tab === t.key ? '#7c3aed' : '#6b7280',
              borderBottom: tab === t.key ? '3px solid #7c3aed' : '3px solid transparent',
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div data-testid="custom-view-panel">
        {tab === 'calendar' && <LessonCalendar />}
        {tab === 'progress' && <StudentProgressChart />}
        {tab === 'invoice' && <InvoicePDF />}
        {tab === 'recital' && <RecitalProgramBuilder />}
      </div>
    </div>
  );
}
