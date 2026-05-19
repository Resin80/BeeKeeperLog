import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createTreatment } from '../services/api';

const TreatmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    productUsed: '',
    quantity: '',
    notes: '',
    reminderDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTreatment({
        ...formData,
        hiveId: id,
        reminderDate: formData.reminderDate ? new Date(formData.reminderDate).toISOString() : null
      });
      navigate(`/hives/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save treatment');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to={`/hives/${id}`} style={{ color: '#666', textDecoration: 'none' }}>&larr; Back to Hive</Link>
        <h1 style={{ marginTop: '10px' }}>Log Treatment</h1>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Date Applied</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} required />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Product Used</label>
            <input type="text" name="productUsed" value={formData.productUsed} onChange={handleChange} placeholder="e.g. Apiguard, Oxalic Acid" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} required />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Quantity / Dosage</label>
            <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="e.g. 50g tray, 5ml" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} required />
          </div>

          <div style={{ padding: '15px', background: '#FFF7E6', borderRadius: '12px', border: '1px solid #FFCC80' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#E65100' }}>Add Reminder? (e.g. when to remove)</label>
            <input 
              type="date" 
              name="reminderDate" 
              value={formData.reminderDate} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} placeholder="When to remove? Observations?" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>Save Treatment</button>
        </div>
      </form>
    </div>
  );
};

export default TreatmentForm;
