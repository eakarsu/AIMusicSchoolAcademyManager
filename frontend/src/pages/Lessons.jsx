import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'student_id', label: 'Student' },
  { key: 'teacher_id', label: 'Teacher' },
  { key: 'instrument', label: 'Instrument' },
  { key: 'lesson_type', label: 'Type' },
  { key: 'day_of_week', label: 'Day' },
  { key: 'start_time', label: 'Time' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'student_id', label: 'Student ID', type: 'number', required: true },
  { key: 'teacher_id', label: 'Teacher ID', type: 'number', required: true },
  { key: 'instrument', label: 'Instrument', type: 'text' },
  { key: 'lesson_type', label: 'Lesson Type', type: 'select', options: ['Private','Group','Online'] },
  { key: 'day_of_week', label: 'Day of Week', type: 'select', options: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
  { key: 'start_time', label: 'Start Time', type: 'time' },
  { key: 'end_time', label: 'End Time', type: 'time' },
  { key: 'duration', label: 'Duration (min)', type: 'number' },
  { key: 'room_id', label: 'Room ID', type: 'number' },
  { key: 'price', label: 'Price', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active','Cancelled','Completed'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Lessons() {
  return <FeaturePage title="Lessons" apiEndpoint="/lessons" columns={columns} formFields={formFields} />;
}
