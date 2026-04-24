import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'student_id', label: 'Student' },
  { key: 'date', label: 'Date' },
  { key: 'duration_minutes', label: 'Duration' },
  { key: 'piece', label: 'Piece' },
  { key: 'rating', label: 'Rating' },
];

const formFields = [
  { key: 'student_id', label: 'Student ID', type: 'number', required: true },
  { key: 'date', label: 'Date', type: 'date', required: true },
  { key: 'duration_minutes', label: 'Duration (minutes)', type: 'number', required: true },
  { key: 'piece', label: 'Piece', type: 'text' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
  { key: 'rating', label: 'Rating', type: 'select', options: ['1','2','3','4','5'] },
  { key: 'teacher_feedback', label: 'Teacher Feedback', type: 'textarea' },
];

export default function PracticeLogs() {
  return <FeaturePage title="Practice Logs" apiEndpoint="/practice-logs" columns={columns} formFields={formFields} />;
}
