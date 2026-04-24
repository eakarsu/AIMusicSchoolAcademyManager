import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'first_name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'specialties', label: 'Specialties' },
  { key: 'hourly_rate', label: 'Hourly Rate' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'first_name', label: 'First Name', type: 'text', required: true },
  { key: 'last_name', label: 'Last Name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'specialties', label: 'Specialties', type: 'text' },
  { key: 'bio', label: 'Bio', type: 'textarea' },
  { key: 'hourly_rate', label: 'Hourly Rate', type: 'number' },
  { key: 'commission_rate', label: 'Commission Rate (%)', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active','Inactive','On Leave'] },
  { key: 'hire_date', label: 'Hire Date', type: 'date' },
];

export default function Teachers() {
  return <FeaturePage title="Teachers" apiEndpoint="/teachers" columns={columns} formFields={formFields} />;
}
