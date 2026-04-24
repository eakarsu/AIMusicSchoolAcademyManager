import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'instrument_id', label: 'Instrument' },
  { key: 'student_id', label: 'Student' },
  { key: 'start_date', label: 'Start Date' },
  { key: 'end_date', label: 'End Date' },
  { key: 'monthly_rate', label: 'Monthly Rate' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'instrument_id', label: 'Instrument ID', type: 'number', required: true },
  { key: 'student_id', label: 'Student ID', type: 'number', required: true },
  { key: 'start_date', label: 'Start Date', type: 'date', required: true },
  { key: 'end_date', label: 'End Date', type: 'date' },
  { key: 'monthly_rate', label: 'Monthly Rate', type: 'number' },
  { key: 'deposit', label: 'Deposit', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active','Returned','Overdue'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Rentals() {
  return <FeaturePage title="Rentals" apiEndpoint="/rentals" columns={columns} formFields={formFields} />;
}
