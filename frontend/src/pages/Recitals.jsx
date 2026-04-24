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

export default function Recitals() {
  return <FeaturePage title="Recitals" apiEndpoint="/recitals" columns={columns} formFields={formFields} />;
}
