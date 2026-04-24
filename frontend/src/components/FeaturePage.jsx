import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import DetailModal from './DetailModal';
import { FaPlus, FaSync, FaSearch, FaTimes, FaInbox } from 'react-icons/fa';

export default function FeaturePage({ title, apiEndpoint, columns, formFields }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({});
  const [error, setError] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(apiEndpoint);
      setItems(Array.isArray(res.data) ? res.data : (res.data.data || res.data.items || []));
    } catch (err) {
      console.error('Fetch error:', err);
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [apiEndpoint]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const s = search.toLowerCase();
    return items.filter(item =>
      Object.values(item).some(v => v && String(v).toLowerCase().includes(s))
    );
  }, [items, search]);

  const handleSave = async (data) => {
    try {
      await api.put(`${apiEndpoint}/${data.id}`, data);
      setSelectedItem(null);
      fetchItems();
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${apiEndpoint}/${id}`);
      setSelectedItem(null);
      fetchItems();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCreate = async () => {
    setError('');
    try {
      await api.post(apiEndpoint, createData);
      setShowCreate(false);
      setCreateData({});
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleCreateChange = (key, value) => {
    setCreateData(prev => ({ ...prev, [key]: value }));
  };

  const getCellValue = (item, key) => {
    const val = item[key];
    if (val === null || val === undefined || val === '') return '-';
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

  return (
    <div className="feature-page">
      <div className="feature-header">
        <h1>{title}</h1>
        <div className="feature-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary" onClick={fetchItems} title="Refresh">
            <FaSync />
          </button>
          <button className="btn btn-primary" onClick={() => { setCreateData({}); setShowCreate(true); setError(''); }}>
            <FaPlus /> Add New
          </button>
        </div>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Loading {title.toLowerCase()}...</div>
        </div>
      ) : (
        <div className="table-container">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><FaInbox /></div>
              <h3>No {title} Found</h3>
              <p>{search ? 'Try adjusting your search terms.' : `Click "Add New" to create your first ${title.toLowerCase()} record.`}</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map(col => <th key={col.key}>{col.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} onClick={() => setSelectedItem(item)}>
                    {columns.map(col => {
                      const val = getCellValue(item, col.key);
                      const badge = getBadgeClass(val);
                      return (
                        <td key={col.key}>
                          {badge ? <span className={`badge ${badge}`}>{val}</span> : val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          columns={columns}
          formFields={formFields}
          onClose={() => setSelectedItem(null)}
          onSave={handleSave}
          onDelete={handleDelete}
          title={title}
        />
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New {title}</h2>
              <button className="modal-close" onClick={() => setShowCreate(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              {error && <div className="login-error">{error}</div>}
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
                        value={createData[field.key] || ''}
                        onChange={e => handleCreateChange(field.key, e.target.value)}
                      >
                        <option value="">Select...</option>
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        className="form-textarea"
                        value={createData[field.key] || ''}
                        onChange={e => handleCreateChange(field.key, e.target.value)}
                      />
                    ) : field.type === 'checkbox' ? (
                      <div className="form-checkbox-wrapper">
                        <input
                          type="checkbox"
                          checked={!!createData[field.key]}
                          onChange={e => handleCreateChange(field.key, e.target.checked)}
                        />
                        <span>{field.label}</span>
                      </div>
                    ) : (
                      <input
                        className="form-input"
                        type={field.type || 'text'}
                        value={createData[field.key] || ''}
                        onChange={e => handleCreateChange(field.key, field.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
