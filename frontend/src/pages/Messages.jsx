import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'sender_name', label: 'Sender' },
  { key: 'subject', label: 'Subject' },
  { key: 'recipient_type', label: 'Recipient Type' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'sender_name', label: 'Sender Name', type: 'text', required: true },
  { key: 'recipient_type', label: 'Recipient Type', type: 'select', options: ['Student','Teacher','Parent','All'] },
  { key: 'subject', label: 'Subject', type: 'text', required: true },
  { key: 'body', label: 'Body', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'select', options: ['Sent','Draft','Read'] },
];

export default function Messages() {
  return <FeaturePage title="Messages" apiEndpoint="/messages" columns={columns} formFields={formFields} />;
}
