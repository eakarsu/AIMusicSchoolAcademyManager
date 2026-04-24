import React, { useState } from 'react';
import { FaTimes, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

export default function DetailModal({ item, columns, formFields, onClose, onSave, onDelete, title }) {
  const [mode, setMode] = useState('view'); // view, edit, confirmDelete
  const [formData, setFormData] = useState({ ...item });

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setMode('view');
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  const formatLabel = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatValue = (val) => {
    if (val === null || val === undefined || val === '') return '-';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return String(val);
  };

  const getBadgeClass = (val) => {
    if (!val || typeof val !== 'string') return '';
    const v = val.toLowerCase();
    const map = {
      active: 'badge-active', paid: 'badge-paid', present: 'badge-present',
      completed: 'badge-completed', confirmed: 'badge-confirmed', enrolled: 'badge-enrolled',
      available: 'badge-available', inactive: 'badge-inactive', cancelled: 'badge-cancelled',
      absent: 'badge-absent', withdrawn: 'badge-withdrawn', retired: 'badge-retired',
      discontinued: 'badge-discontinued', pending: 'badge-pending', waiting: 'badge-waiting',
      scheduled: 'badge-scheduled', requested: 'badge-requested', upcoming: 'badge-upcoming',
      planned: 'badge-planned', draft: 'badge-draft', overdue: 'badge-overdue', late: 'badge-late',
      'in stock': 'badge-active', 'low stock': 'badge-pending', 'out of stock': 'badge-inactive',
      open: 'badge-active', full: 'badge-pending', passed: 'badge-active', failed: 'badge-inactive',
      sent: 'badge-active', read: 'badge-active', processed: 'badge-pending',
      'no show': 'badge-inactive', converted: 'badge-active', offered: 'badge-pending',
      'in progress': 'badge-pending',
    };
    return map[v] || '';
  };

  if (mode === 'confirmDelete') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
          <div className="modal-body">
            <div className="confirm-dialog">
              <div className="confirm-icon"><FaExclamationTriangle /></div>
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this record? This action cannot be undone.</p>
              <div className="confirm-actions">
                <button className="btn btn-secondary" onClick={() => setMode('view')}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'edit') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Edit {title}</h2>
            <button className="modal-close" onClick={onClose}><FaTimes /></button>
          </div>
          <div className="modal-body">
            <div className="form-grid">
              {formFields.map(field => (
                <div className={`form-group ${field.type === 'textarea' ? 'full-width' : ''}`} key={field.key}>
                  <label>
                    {field.label}
                    {field.required && <span className="required">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      className="form-select"
                      value={formData[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                    >
                      <option value="">Select...</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      className="form-textarea"
                      value={formData[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                    />
                  ) : field.type === 'checkbox' ? (
                    <div className="form-checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={!!formData[field.key]}
                        onChange={e => handleChange(field.key, e.target.checked)}
                      />
                      <span>{field.label}</span>
                    </div>
                  ) : (
                    <input
                      className="form-input"
                      type={field.type || 'text'}
                      value={formData[field.key] || ''}
                      onChange={e => handleChange(field.key, field.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setMode('view')}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    );
  }

  // View mode
  const allKeys = Object.keys(item).filter(k => k !== 'id' && k !== 'created_at' && k !== 'updated_at');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title} Details</h2>
          <button className="modal-close" onClick={onClose}><FaTimes /></button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            {allKeys.map(key => {
              const val = item[key];
              const badge = getBadgeClass(val);
              const isLong = typeof val === 'string' && val.length > 60;
              return (
                <div className={`detail-field ${isLong ? 'full-width' : ''}`} key={key}>
                  <div className="detail-label">{formatLabel(key)}</div>
                  <div className="detail-value">
                    {badge ? <span className={`badge ${badge}`}>{val}</span> : formatValue(val)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={() => setMode('confirmDelete')}>
            <FaTrash /> Delete
          </button>
          <button className="btn btn-primary" onClick={() => setMode('edit')}>
            <FaEdit /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}
