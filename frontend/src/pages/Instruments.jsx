import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'brand', label: 'Brand' },
  { key: 'condition', label: 'Condition' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'type', label: 'Type', type: 'select', options: ['String','Woodwind','Brass','Percussion','Keyboard','Other'] },
  { key: 'brand', label: 'Brand', type: 'text' },
  { key: 'model', label: 'Model', type: 'text' },
  { key: 'serial_number', label: 'Serial Number', type: 'text' },
  { key: 'condition', label: 'Condition', type: 'select', options: ['Excellent','Good','Fair','Poor'] },
  { key: 'purchase_date', label: 'Purchase Date', type: 'date' },
  { key: 'purchase_price', label: 'Purchase Price', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Available','In Use','Rented','Repair','Retired'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Instruments() {
  return <FeaturePage title="Instruments" apiEndpoint="/instruments" columns={columns} formFields={formFields} />;
}
