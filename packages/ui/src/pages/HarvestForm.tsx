import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createHarvest } from '../services/api';

const HarvestForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    productType: 'Honey',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createHarvest({
        ...formData,
        hiveId: id
      });
      navigate(`/hives/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save harvest');
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
        <h1 style={{ marginTop: '10px' }}>Log Harvest</h1>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} required />
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Weight (kg/lb)</label>
              <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} placeholder="0.0" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Product</label>
              <select name="productType" value={formData.productType} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option>Honey</option>
                <option>Wax</option>
                <option>Propolis</option>
                <option>Pollen</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>Save Harvest</button>
        </div>
      </form>
    </div>
  );
};

export default HarvestForm;
