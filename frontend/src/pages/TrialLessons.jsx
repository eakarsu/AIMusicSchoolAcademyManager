import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'student_name', label: 'Student Name' },
  { key: 'instrument', label: 'Instrument' },
  { key: 'preferred_date', label: 'Preferred Date' },
  { key: 'teacher_id', label: 'Teacher' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'student_name', label: 'Student Name', type: 'text', required: true },
  { key: 'parent_name', label: 'Parent Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'instrument', label: 'Instrument', type: 'text' },
  { key: 'preferred_date', label: 'Preferred Date', type: 'date' },
  { key: 'preferred_time', label: 'Preferred Time', type: 'time' },
  { key: 'teacher_id', label: 'Teacher ID', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Requested','Scheduled','Completed','No Show','Converted'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function TrialLessons() {
  return <FeaturePage title="Trial Lessons" apiEndpoint="/trial-lessons" columns={columns} formFields={formFields} />;
}
