import React, { useEffect, useState } from 'react';
import { fetchHives } from '../services/api';
import { Bug, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const HiveList: React.FC = () => {
  const [hives, setHives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHives()
      .then(data => {
        setHives(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container">Loading Hives...</div>;

  return (
    <div className="container">
      <div className="header-flex" style={{ marginBottom: '30px' }}>
        <h1>My Hives</h1>
        <Link to="/hives/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>+ Add New Hive</Link>
      </div>

      <div className="grid">
        {hives.map(hive => (
          <Link to={`/hives/${hive.id}`} key={hive.id} className="hive-card-link">
            <div className="card hive-card">
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                {hive.imagePath && (
                  <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={hive.imagePath} alt={hive.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div className="hive-card-header">
                    <h3>{hive.name}</h3>
                    <span className={`status-badge status-${hive.status.toLowerCase()}`}>
                      {hive.status}
                    </span>
                  </div>
                  <div className="info-row" style={{ marginTop: '5px' }}>
                    <Bug size={18} color="#666" />
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>{hive.type} | {hive.honeySupers} Supers</span>
                  </div>
                </div>
              </div>
              
              <div className="hive-card-details">
                <div className="info-row">
                  <MapPin size={18} />
                  <span>Apiary: {hive.apiary?.name || 'Unknown'}</span>
                </div>
                <div className="info-row">
                  <Calendar size={18} />
                  <span>Installed: {new Date(hive.installDate).toLocaleDateString()}</span>
                </div>
                <div className="queen-info-badge">
                  <div className="queen-color-dot" style={{ 
                    backgroundColor: hive.queenColor === 'Queenless' ? '#000' :
                                     hive.queenColor?.startsWith('White') ? '#fff' : 
                                     hive.queenColor?.startsWith('Yellow') ? '#ffeb3b' : 
                                     hive.queenColor?.startsWith('Red') ? '#f44336' : 
                                     hive.queenColor?.startsWith('Green') ? '#4caf50' : 
                                     hive.queenColor?.startsWith('Blue') ? '#2196f3' : '#ccc',
                    border: hive.queenColor === 'Queenless' ? 'none' : '1px solid #999',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '8px',
                    fontWeight: 'bold'
                  }}>
                    {hive.queenColor === 'Queenless' && 'X'}
                  </div>
                  <span className={`queen-text ${hive.queenColor === 'Queenless' ? 'queenless' : ''}`}>
                    {hive.queenColor === 'Queenless' ? 'QUEENLESS' : `Queen: ${hive.queenColor || 'Unmarked'}`}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HiveList;
