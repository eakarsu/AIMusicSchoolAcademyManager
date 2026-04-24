import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'first_name', label: 'Name' },
  { key: 'instrument', label: 'Instrument' },
  { key: 'level', label: 'Level' },
  { key: 'status', label: 'Status' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
];

const formFields = [
  { key: 'first_name', label: 'First Name', type: 'text', required: true },
  { key: 'last_name', label: 'Last Name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'date_of_birth', label: 'Date of Birth', type: 'date' },
  { key: 'instrument', label: 'Instrument', type: 'select', options: ['Piano','Guitar','Violin','Cello','Flute','Clarinet','Drums','Voice','Saxophone','Trumpet','Trombone','Harp','Viola','Oboe','Bassoon'] },
  { key: 'level', label: 'Level', type: 'select', options: ['Beginner','Elementary','Intermediate','Advanced','Pre-Professional'] },
  { key: 'parent_name', label: 'Parent Name', type: 'text' },
  { key: 'parent_email', label: 'Parent Email', type: 'email' },
  { key: 'parent_phone', label: 'Parent Phone', type: 'text' },
  { key: 'address', label: 'Address', type: 'text' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active','Inactive','Graduated','On Hold'] },
];

export default function Students() {
  return <FeaturePage title="Students" apiEndpoint="/students" columns={columns} formFields={formFields} />;
}
