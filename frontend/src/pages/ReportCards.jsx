import React from 'react';
import FeaturePage from '../components/FeaturePage';

const gradeOptions = ['A+','A','A-','B+','B','B-','C+','C','C-','D','F'];

const columns = [
  { key: 'student_id', label: 'Student' },
  { key: 'term', label: 'Term' },
  { key: 'year', label: 'Year' },
  { key: 'instrument', label: 'Instrument' },
  { key: 'overall_grade', label: 'Overall Grade' },
];

const formFields = [
  { key: 'student_id', label: 'Student ID', type: 'number', required: true },
  { key: 'teacher_id', label: 'Teacher ID', type: 'number' },
  { key: 'term', label: 'Term', type: 'select', options: ['Fall','Winter','Spring','Summer'] },
  { key: 'year', label: 'Year', type: 'number' },
  { key: 'instrument', label: 'Instrument', type: 'text' },
  { key: 'technique_grade', label: 'Technique Grade', type: 'select', options: gradeOptions },
  { key: 'musicality_grade', label: 'Musicality Grade', type: 'select', options: gradeOptions },
  { key: 'theory_grade', label: 'Theory Grade', type: 'select', options: gradeOptions },
  { key: 'sight_reading_grade', label: 'Sight Reading Grade', type: 'select', options: gradeOptions },
  { key: 'practice_grade', label: 'Practice Grade', type: 'select', options: gradeOptions },
  { key: 'overall_grade', label: 'Overall Grade', type: 'select', options: gradeOptions },
  { key: 'comments', label: 'Comments', type: 'textarea' },
  { key: 'goals', label: 'Goals', type: 'textarea' },
];

export default function ReportCards() {
  return <FeaturePage title="Report Cards" apiEndpoint="/report-cards" columns={columns} formFields={formFields} />;
}
