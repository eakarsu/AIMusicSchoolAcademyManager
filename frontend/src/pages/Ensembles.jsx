import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'director', label: 'Director' },
  { key: 'rehearsal_day', label: 'Rehearsal Day' },
  { key: 'level', label: 'Level' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'type', label: 'Type', type: 'text' },
  { key: 'director', label: 'Director', type: 'text' },
  { key: 'rehearsal_day', label: 'Rehearsal Day', type: 'select', options: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
  { key: 'rehearsal_time', label: 'Rehearsal Time', type: 'time' },
  { key: 'room_id', label: 'Room ID', type: 'number' },
  { key: 'max_members', label: 'Max Members', type: 'number' },
  { key: 'level', label: 'Level', type: 'select', options: ['Beginner','Intermediate','Advanced'] },
  { key: 'status', label: 'Status', type: 'select', options: ['Active','Inactive'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Ensembles() {
  return <FeaturePage title="Ensembles" apiEndpoint="/ensembles" columns={columns} formFields={formFields} />;
}
