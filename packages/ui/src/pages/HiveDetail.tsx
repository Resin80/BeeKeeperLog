import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchHiveById, deleteHive, deleteInspection } from '../services/api';
import { Calendar, Bug, MapPin, ClipboardList, Plus, Trash2, Printer, Edit } from 'lucide-react';

const HiveDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hive, setHive] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (id) {
      fetchHiveById(id)
        .then(data => {
          setHive(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${hive.name}"? This will also remove all its inspection logs.`)) {
      try {
        await deleteHive(id!);
        navigate('/hives');
      } catch (err: any) {
        console.error(err);
        alert(`Failed to delete hive: ${err.message || 'Unknown error'}`);
      }
    }
  };

  const handleDeleteInspection = async (inspId: string) => {
    if (window.confirm('Are you sure you want to delete this inspection record?')) {
      try {
        await deleteInspection(inspId);
        if (id) {
          fetchHiveById(id).then(data => setHive(data));
        }
      } catch (err: any) {
        console.error(err);
        alert(`Failed to delete inspection: ${err.message}`);
      }
    }
  };

  if (loading) return <div className="container">Loading Hive Details...</div>;
  if (!hive) return <div className="container">Hive not found.</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <Link to="/hives" className="no-print" style={{ color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
          &larr; Back to Hives
        </Link>
        <div className="header-flex">
          <h1>{hive.name}</h1>
          <div className="action-buttons no-print">
            <button onClick={handlePrint} className="btn btn-secondary">
              <Printer size={20} /> <span className="btn-text">Print</span>
            </button>
            <Link to={`/hives/${id}/edit`} className="btn btn-secondary btn-edit">
              <Plus size={20} style={{ transform: 'rotate(45deg)' }} /> <span className="btn-text">Edit</span>
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              <Trash2 size={20} /> <span className="btn-text">Delete</span>
            </button>
            <Link to={`/hives/${id}/inspect`} className="btn btn-primary">
              <Plus size={20} /> Log Inspection
            </Link>
          </div>
        </div>
      </div>

      <div className="management-bar no-print">
        <Link to={`/hives/${id}/harvest`} className="btn btn-harvest">+ Log Harvest</Link>
        <Link to={`/hives/${id}/treatment`} className="btn btn-treatment">+ Log Treatment</Link>
        <Link to={`/hives/${id}/feed`} className="btn btn-feeding">+ Record Feeding</Link>
      </div>

      <div className="grid">
        {hive.imagePath && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={hive.imagePath} alt={hive.name} style={{ width: '100%', height: '100%', minHeight: '300px', objectFit: 'cover' }} />
          </div>
        )}
        <div className="card">
          <h2 style={{ marginBottom: '15px' }}>Hive Info</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bug size={20} color="#FFB900" />
              <strong>Type:</strong> {hive.type}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Plus size={20} color="#FFB900" />
              <strong>Honey Supers:</strong> {hive.honeySupers || 0}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ClipboardList size={20} color="#8D6E63" />
              <strong>Brood Setup:</strong> {hive.broodBoxes === 2 ? 'Double Brood' : 'Single Brood'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '18px', 
                height: '18px', 
                borderRadius: '50%', 
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
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {hive.queenColor === 'Queenless' && 'X'}
              </div>
              <strong style={{ color: hive.queenColor === 'Queenless' ? '#D93025' : 'inherit' }}>
                {hive.queenColor === 'Queenless' ? 'QUEENLESS HIVE' : `Queen Color: ${hive.queenColor || 'Unmarked'}`}
              </strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={20} color="#4CAF50" />
              <strong>Apiary:</strong> {hive.apiary?.name}
            </div>
            {hive.latitude && hive.longitude && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} color="#FF5722" />
                <strong>Location:</strong> {hive.latitude.toFixed(4)}, {hive.longitude.toFixed(4)}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={20} color="#2196F3" />
              <strong>Installed:</strong> {new Date(hive.installDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '15px' }}>Quick Stats</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <strong>Total Inspections:</strong> {hive.inspections?.length || 0}
            </div>
            <div>
              <strong>Honey Harvested:</strong> {hive.harvests?.reduce((acc: number, h: any) => acc + h.weight, 0).toFixed(1)} kg/lb
            </div>
            <div>
              <strong>Last Inspected:</strong> {hive.inspections?.[0] ? new Date(hive.inspections[0].date).toLocaleDateString() : 'Never'}
            </div>
          </div>
        </div>
      </div>

      <div className="history-grid" style={{ marginTop: '30px' }}>
        <div>
          <h2 style={{ marginBottom: '20px' }}>Inspection History</h2>
          {hive.inspections && hive.inspections.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {hive.inspections.map((insp: any) => (
                <div key={insp.id} className="card" style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                      <ClipboardList size={20} color="#666" />
                      {new Date(insp.date).toLocaleDateString()}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link to={`/hives/${id}/inspect/${insp.id}/edit`} style={{ color: '#2196F3', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => handleDeleteInspection(insp.id)} style={{ background: 'none', border: 'none', color: '#D93025', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={16} />
                      </button>
                      {insp.queenSeen && <span style={{ background: '#E6F4EA', color: '#1E7E34', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Queen Seen</span>}
                      {insp.eggsPresent && <span style={{ background: '#E6F4EA', color: '#1E7E34', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Eggs Present</span>}
                      {insp.queenCellsFound && <span style={{ background: '#FFF0F0', color: '#D32F2F', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid #FFCDD2' }}>Cells Found! ({insp.queenCellsAction})</span>}
                      <span style={{ background: '#E6F0FF', color: '#2196F3', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{insp.broodBoxes === 2 ? 'Double' : 'Single'} Brood</span>
                    </div>
                  </div>
                  
                  {insp.frameData && (
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', background: '#8D6E63', padding: '6px', borderRadius: '4px' }}>
                        {insp.frameData.split(',').map((val: string, idx: number) => (
                          <div key={idx} style={{ 
                            flex: `1 0 ${insp.broodBoxes === 2 ? '8%' : '9%'}`, 
                            height: '25px',
                            background: val === '1' ? '#FFB900' : (val === '2' ? '#64B5F6' : '#D7CCC8'), 
                            borderRadius: '1px' 
                          }} />
                        ))}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                        {insp.framesOfBees} frames of bees | {insp.framesOfFood} frames of food
                      </p>
                    </div>
                  )}

                  {insp.imagePath && (
                    <div style={{ marginBottom: '15px' }}>
                      <img src={insp.imagePath} alt="Inspection" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                    </div>
                  )}

                  <div style={{ color: '#555', fontSize: '0.95rem' }}>
                    <p><strong>Temperament:</strong> {insp.temperament} | <strong>Population:</strong> {insp.population}</p>
                    {insp.notes && <p style={{ marginTop: '10px', fontStyle: 'italic' }}>"{insp.notes}"</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card">
              <p style={{ color: '#666' }}>No inspections yet.</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <h2 style={{ marginBottom: '20px' }}>Recent Management</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {hive.treatments?.map((t: any) => (
                <div key={t.id} className="card" style={{ borderLeft: '4px solid #4CAF50' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Treatment: {t.productUsed}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(t.date).toLocaleDateString()} | {t.quantity}</div>
                </div>
              ))}
              {hive.feedings?.map((f: any) => (
                <div key={f.id} className="card" style={{ borderLeft: '4px solid #2196F3' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Feeding: {f.type}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(f.date).toLocaleDateString()} | {f.amount}</div>
                </div>
              ))}
              {(!hive.treatments?.length && !hive.feedings?.length) && <p style={{ color: '#666' }}>No management logs yet.</p>}
            </div>
          </div>

          <div>
            <h2 style={{ marginBottom: '20px' }}>Harvest History</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {hive.harvests?.map((h: any) => (
                <div key={h.id} className="card" style={{ borderLeft: '4px solid #FFB900' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{h.productType}: {h.weight} kg/lb</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(h.date).toLocaleDateString()}</div>
                </div>
              ))}
              {!hive.harvests?.length && <p style={{ color: '#666' }}>No harvests recorded yet.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {hive.inspections?.some((insp: any) => insp.imagePath) && (
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px' }}>Hive Gallery</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
            gap: '10px' 
          }}>
            {hive.inspections
              .filter((insp: any) => insp.imagePath)
              .map((insp: any) => (
                <div key={insp.id} style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer' }} onClick={() => window.open(insp.imagePath, '_blank')}>
                  <img 
                    src={insp.imagePath} 
                    alt={`Inspection ${new Date(insp.date).toLocaleDateString()}`} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    background: 'rgba(0,0,0,0.5)', 
                    color: 'white', 
                    fontSize: '0.7rem', 
                    padding: '2px 5px',
                    textAlign: 'center'
                  }}>
                    {new Date(insp.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HiveDetail;
