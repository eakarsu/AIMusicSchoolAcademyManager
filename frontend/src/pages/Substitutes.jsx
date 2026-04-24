import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'teacher_id', label: 'Teacher' },
  { key: 'substitute_teacher_id', label: 'Substitute' },
  { key: 'lesson_id', label: 'Lesson' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'teacher_id', label: 'Teacher ID', type: 'number', required: true },
  { key: 'substitute_teacher_id', label: 'Substitute Teacher ID', type: 'number', required: true },
  { key: 'lesson_id', label: 'Lesson ID', type: 'number' },
  { key: 'date', label: 'Date', type: 'date', required: true },
  { key: 'reason', label: 'Reason', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Requested','Confirmed','Completed','Cancelled'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Substitutes() {
  return <FeaturePage title="Substitutes" apiEndpoint="/substitutes" columns={columns} formFields={formFields} />;
}
