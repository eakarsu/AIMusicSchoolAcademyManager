import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'student_id', label: 'Student' },
  { key: 'exam_type', label: 'Exam Type' },
  { key: 'level', label: 'Level' },
  { key: 'score', label: 'Score' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'student_id', label: 'Student ID', type: 'number', required: true },
  { key: 'exam_type', label: 'Exam Type', type: 'text', required: true },
  { key: 'level', label: 'Level', type: 'text' },
  { key: 'score', label: 'Score', type: 'number' },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'examiner', label: 'Examiner', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Scheduled','Passed','Failed','Deferred'] },
  { key: 'certificate_issued', label: 'Certificate Issued', type: 'checkbox' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Grades() {
  return <FeaturePage title="Grades" apiEndpoint="/grades" columns={columns} formFields={formFields} />;
}
