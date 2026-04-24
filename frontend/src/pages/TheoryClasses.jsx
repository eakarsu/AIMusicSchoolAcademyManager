import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'level', label: 'Level' },
  { key: 'teacher_id', label: 'Teacher' },
  { key: 'day_of_week', label: 'Day' },
  { key: 'start_time', label: 'Time' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'level', label: 'Level', type: 'text' },
  { key: 'teacher_id', label: 'Teacher ID', type: 'number' },
  { key: 'day_of_week', label: 'Day of Week', type: 'select', options: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
  { key: 'start_time', label: 'Start Time', type: 'time' },
  { key: 'end_time', label: 'End Time', type: 'time' },
  { key: 'room_id', label: 'Room ID', type: 'number' },
  { key: 'max_students', label: 'Max Students', type: 'number' },
  { key: 'price', label: 'Price', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active','Full','Completed'] },
  { key: 'syllabus', label: 'Syllabus', type: 'textarea' },
];

export default function TheoryClasses() {
  return <FeaturePage title="Theory Classes" apiEndpoint="/theory-classes" columns={columns} formFields={formFields} />;
}
