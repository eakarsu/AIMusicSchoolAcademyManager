import React from 'react';
import FeaturePage from '../components/FeaturePage';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'category', label: 'Category', type: 'select', options: ['Books','Accessories','Apparel','Instruments','Gifts','Other'] },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'price', label: 'Price', type: 'number', required: true },
  { key: 'cost', label: 'Cost', type: 'number' },
  { key: 'stock', label: 'Stock', type: 'number' },
  { key: 'sku', label: 'SKU', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['In Stock','Low Stock','Out of Stock','Discontinued'] },
];

export default function Merchandise() {
  return <FeaturePage title="Merchandise" apiEndpoint="/merchandise" columns={columns} formFields={formFields} />;
}
