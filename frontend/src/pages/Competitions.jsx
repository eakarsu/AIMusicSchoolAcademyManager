import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'date', label: 'Date' },
  { key: 'location', label: 'Location' },
  { key: 'category', label: 'Category' },
  { key: 'entry_fee', label: 'Entry Fee' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'date', label: 'Date', type: 'date', required: true },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'registration_deadline', label: 'Registration Deadline', type: 'date' },
  { key: 'entry_fee', label: 'Entry Fee', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Upcoming','In Progress','Completed'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Competitions() {
  return <FeaturePage title="Competitions" apiEndpoint="/competitions" columns={columns} formFields={formFields} />;
}
