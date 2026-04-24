import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'student_id', label: 'Student' },
  { key: 'type', label: 'Type' },
  { key: 'title', label: 'Title' },
  { key: 'date_issued', label: 'Date Issued' },
  { key: 'level', label: 'Level' },
];

const formFields = [
  { key: 'student_id', label: 'Student ID', type: 'number', required: true },
  { key: 'type', label: 'Type', type: 'select', options: ['Achievement','Completion','Excellence','Participation','Recital'] },
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'date_issued', label: 'Date Issued', type: 'date' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'level', label: 'Level', type: 'text' },
  { key: 'issued_by', label: 'Issued By', type: 'text' },
];

export default function Certificates() {
  return <FeaturePage title="Certificates" apiEndpoint="/certificates" columns={columns} formFields={formFields} />;
}
