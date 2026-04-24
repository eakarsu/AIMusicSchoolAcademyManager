import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'start_date', label: 'Dates' },
  { key: 'age_group', label: 'Age Group' },
  { key: 'instrument_focus', label: 'Instrument' },
  { key: 'price', label: 'Price' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'start_date', label: 'Start Date', type: 'date', required: true },
  { key: 'end_date', label: 'End Date', type: 'date' },
  { key: 'age_group', label: 'Age Group', type: 'text' },
  { key: 'instrument_focus', label: 'Instrument Focus', type: 'text' },
  { key: 'max_enrollment', label: 'Max Enrollment', type: 'number' },
  { key: 'price', label: 'Price', type: 'number' },
  { key: 'instructor', label: 'Instructor', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'select', options: ['Open','Full','Completed','Cancelled'] },
];

export default function SummerCamps() {
  return <FeaturePage title="Summer Camps" apiEndpoint="/summer-camps" columns={columns} formFields={formFields} />;
}
