import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'teacher_id', label: 'Teacher' },
  { key: 'period_start', label: 'Period' },
  { key: 'lessons_count', label: 'Lessons' },
  { key: 'hours_worked', label: 'Hours' },
  { key: 'base_pay', label: 'Base Pay' },
  { key: 'total_pay', label: 'Total Pay' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'teacher_id', label: 'Teacher ID', type: 'number', required: true },
  { key: 'period_start', label: 'Period Start', type: 'date', required: true },
  { key: 'period_end', label: 'Period End', type: 'date', required: true },
  { key: 'lessons_count', label: 'Lessons Count', type: 'number' },
  { key: 'hours_worked', label: 'Hours Worked', type: 'number' },
  { key: 'base_pay', label: 'Base Pay', type: 'number' },
  { key: 'commission', label: 'Commission', type: 'number' },
  { key: 'deductions', label: 'Deductions', type: 'number' },
  { key: 'total_pay', label: 'Total Pay', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Pending','Processed','Paid'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Payroll() {
  return <FeaturePage title="Payroll" apiEndpoint="/payroll" columns={columns} formFields={formFields} />;
}
