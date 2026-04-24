import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'student_name', label: 'Student Name' },
  { key: 'instrument', label: 'Instrument' },
  { key: 'preferred_day', label: 'Preferred Day' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'student_name', label: 'Student Name', type: 'text', required: true },
  { key: 'parent_name', label: 'Parent Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'instrument', label: 'Instrument', type: 'text' },
  { key: 'preferred_day', label: 'Preferred Day', type: 'text' },
  { key: 'preferred_time', label: 'Preferred Time', type: 'text' },
  { key: 'teacher_preference', label: 'Teacher Preference', type: 'text' },
  { key: 'priority', label: 'Priority', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Waiting','Offered','Enrolled','Withdrawn'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function WaitingList() {
  return <FeaturePage title="Waiting List" apiEndpoint="/waiting-list" columns={columns} formFields={formFields} />;
}
