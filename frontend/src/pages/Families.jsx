import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'family_name', label: 'Family Name' },
  { key: 'primary_contact', label: 'Primary Contact' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'discount_percentage', label: 'Discount %' },
];

const formFields = [
  { key: 'family_name', label: 'Family Name', type: 'text', required: true },
  { key: 'primary_contact', label: 'Primary Contact', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'address', label: 'Address', type: 'text' },
  { key: 'discount_percentage', label: 'Discount Percentage', type: 'number' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Families() {
  return <FeaturePage title="Families" apiEndpoint="/families" columns={columns} formFields={formFields} />;
}
