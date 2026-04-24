import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'student_id', label: 'Student' },
  { key: 'lesson_id', label: 'Lesson' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'lesson_id', label: 'Lesson ID', type: 'number', required: true },
  { key: 'student_id', label: 'Student ID', type: 'number', required: true },
  { key: 'date', label: 'Date', type: 'date', required: true },
  { key: 'status', label: 'Status', type: 'select', options: ['Present','Absent','Late','Excused'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Attendance() {
  return <FeaturePage title="Attendance" apiEndpoint="/attendance" columns={columns} formFields={formFields} />;
}
