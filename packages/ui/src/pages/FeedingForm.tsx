import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createFeeding } from '../services/api';

const FeedingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '1:1 Syrup',
    amount: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFeeding({
        ...formData,
        hiveId: id
      });
      navigate(`/hives/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save feeding');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to={`/hives/${id}`} style={{ color: '#666', textDecoration: 'none' }}>&larr; Back to Hive</Link>
        <h1 style={{ marginTop: '10px' }}>Record Feeding</h1>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} required />
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Feed Type</label>
              <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option>1:1 Syrup</option>
                <option>2:1 Syrup</option>
                <option>Fondant</option>
                <option>Pollen Patty</option>
                <option>Water</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Amount</label>
              <input type="text" name="amount" value={formData.amount} onChange={handleChange} placeholder="e.g. 5L, 1kg" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} required />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>Save Feeding</button>
        </div>
      </form>
    </div>
  );
};

export default FeedingForm;
