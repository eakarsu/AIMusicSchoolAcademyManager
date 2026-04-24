import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'floor', label: 'Floor' },
  { key: 'hourly_rate', label: 'Hourly Rate' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'capacity', label: 'Capacity', type: 'number' },
  { key: 'equipment', label: 'Equipment', type: 'text' },
  { key: 'hourly_rate', label: 'Hourly Rate', type: 'number' },
  { key: 'floor', label: 'Floor', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Available','Occupied','Maintenance'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Rooms() {
  return <FeaturePage title="Rooms" apiEndpoint="/rooms" columns={columns} formFields={formFields} />;
}
