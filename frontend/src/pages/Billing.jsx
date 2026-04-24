import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'student_id', label: 'Student' },
  { key: 'amount', label: 'Amount' },
  { key: 'description', label: 'Description' },
  { key: 'due_date', label: 'Due Date' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'student_id', label: 'Student ID', type: 'number', required: true },
  { key: 'amount', label: 'Amount', type: 'number', required: true },
  { key: 'description', label: 'Description', type: 'text', required: true },
  { key: 'due_date', label: 'Due Date', type: 'date' },
  { key: 'paid_date', label: 'Paid Date', type: 'date' },
  { key: 'payment_method', label: 'Payment Method', type: 'select', options: ['Cash','Credit Card','Bank Transfer','Check','Online'] },
  { key: 'status', label: 'Status', type: 'select', options: ['Pending','Paid','Overdue','Cancelled'] },
  { key: 'invoice_number', label: 'Invoice Number', type: 'text' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Billing() {
  return <FeaturePage title="Billing" apiEndpoint="/billing" columns={columns} formFields={formFields} />;
}
