import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'date', label: 'Date' },
  { key: 'venue', label: 'Venue' },
  { key: 'status', label: 'Status' },
  { key: 'ticket_price', label: 'Ticket Price' },
];

const formFields = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'date', label: 'Date', type: 'date', required: true },
  { key: 'time', label: 'Time', type: 'time' },
  { key: 'venue', label: 'Venue', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'max_performers', label: 'Max Performers', type: 'number' },
  { key: 'ticket_price', label: 'Ticket Price', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Planned','Confirmed','Completed','Cancelled'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function exportRecitalPDF(recitalId) {
  const token = localStorage.getItem('token');
  fetch(`/api/recitals/${recitalId}/export-pdf`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => {
    if (!res.ok) throw new Error('Export failed');
    return res.blob();
  }).then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recital-${recitalId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }).catch(err => alert('PDF export failed: ' + err.message));
}

function recitalDetailExtraActions(item) {
  if (!item || !item.id) return null;
  return (
    <button
      className="btn btn-secondary"
      onClick={() => exportRecitalPDF(item.id)}
      title="Export PDF"
    >
      Export PDF
    </button>
  );
}

export default function Recitals() {
  return (
    <FeaturePage
      title="Recitals"
      apiEndpoint="/recitals"
      columns={columns}
      formFields={formFields}
      detailExtraActions={recitalDetailExtraActions}
    />
  );
}
