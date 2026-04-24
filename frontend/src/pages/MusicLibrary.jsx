import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'composer', label: 'Composer' },
  { key: 'genre', label: 'Genre' },
  { key: 'difficulty_level', label: 'Difficulty' },
  { key: 'instrument', label: 'Instrument' },
  { key: 'copies_available', label: 'Copies' },
];

const formFields = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'composer', label: 'Composer', type: 'text' },
  { key: 'arranger', label: 'Arranger', type: 'text' },
  { key: 'genre', label: 'Genre', type: 'text' },
  { key: 'difficulty_level', label: 'Difficulty Level', type: 'select', options: ['Beginner','Elementary','Intermediate','Advanced','Professional'] },
  { key: 'instrument', label: 'Instrument', type: 'text' },
  { key: 'isbn', label: 'ISBN', type: 'text' },
  { key: 'publisher', label: 'Publisher', type: 'text' },
  { key: 'copies_available', label: 'Copies Available', type: 'number' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function MusicLibrary() {
  return <FeaturePage title="Music Library" apiEndpoint="/music-library" columns={columns} formFields={formFields} />;
}
