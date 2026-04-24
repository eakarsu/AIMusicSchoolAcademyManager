import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'student_id', label: 'Student' },
  { key: 'teacher_id', label: 'Teacher' },
  { key: 'original_date', label: 'Original Date' },
  { key: 'makeup_date', label: 'Makeup Date' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'original_lesson_id', label: 'Original Lesson ID', type: 'number' },
  { key: 'student_id', label: 'Student ID', type: 'number', required: true },
  { key: 'teacher_id', label: 'Teacher ID', type: 'number', required: true },
  { key: 'original_date', label: 'Original Date', type: 'date', required: true },
  { key: 'makeup_date', label: 'Makeup Date', type: 'date' },
  { key: 'makeup_time', label: 'Makeup Time', type: 'time' },
  { key: 'room_id', label: 'Room ID', type: 'number' },
  { key: 'reason', label: 'Reason', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Scheduled','Completed','Cancelled'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function MakeupLessons() {
  return <FeaturePage title="Makeup Lessons" apiEndpoint="/makeup-lessons" columns={columns} formFields={formFields} />;
}
