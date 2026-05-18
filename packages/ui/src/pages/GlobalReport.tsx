import React, { useEffect, useState } from 'react';
import { fetchHives } from '../services/api';
import { ClipboardList, Printer, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const GlobalReport: React.FC = () => {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchHives()
      .then(hives => {
        // Flatten all inspections from all hives into one list
        const allInspections = hives.flatMap((hive: any) => 
          (hive.inspections || []).map((insp: any) => ({
            ...insp,
            hiveName: hive.name,
            apiaryName: hive.apiary?.name || 'Unknown',
            queenColor: insp.queenColor || hive.queenColor
          }))
        );
        
        // Sort by date descending
        allInspections.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setInspections(allInspections);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const filteredInspections = inspections.filter(insp => 
    insp.hiveName.toLowerCase().includes(filter.toLowerCase()) ||
    insp.apiaryName.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="container">Loading global report...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <ClipboardList size={32} color="#FFB900" />
          <h1>All-Hive Inspection Report</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }} className="no-print">
          <div style={{ position: 'relative' }}>
            <Filter size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Filter by hive or site..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '8px 10px 8px 35px', borderRadius: '8px', border: '1px solid #ddd', width: '250px' }}
            />
          </div>
          <button onClick={handlePrint} className="btn" style={{ background: '#fff', border: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={20} /> Print Table
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F9F7F2', borderBottom: '2px solid #EEE' }}>
              <th style={{ padding: '15px' }}>Date</th>
              <th style={{ padding: '15px' }}>Hive</th>
              <th style={{ padding: '15px' }}>Site</th>
              <th style={{ padding: '15px' }}>Queen Status</th>
              <th style={{ padding: '15px' }}>Bees</th>
              <th style={{ padding: '15px' }}>Food</th>
              <th style={{ padding: '15px' }}>Mites</th>
              <th style={{ padding: '15px' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredInspections.map((insp) => (
              <tr key={insp.id} style={{ borderBottom: '1px solid #EEE' }}>
                <td style={{ padding: '15px', whiteSpace: 'nowrap' }}>{new Date(insp.date).toLocaleDateString()}</td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>
                  <Link to={`/hives/${insp.hiveId}`} style={{ color: '#5D4037', textDecoration: 'none' }}>{insp.hiveName}</Link>
                </td>
                <td style={{ padding: '15px' }}>{insp.apiaryName}</td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      backgroundColor: insp.queenColor === 'Queenless' ? '#000' :
                                       insp.queenColor?.startsWith('White') ? '#fff' : 
                                       insp.queenColor?.startsWith('Yellow') ? '#ffeb3b' : 
                                       insp.queenColor?.startsWith('Red') ? '#f44336' : 
                                       insp.queenColor?.startsWith('Green') ? '#4caf50' : 
                                       insp.queenColor?.startsWith('Blue') ? '#2196f3' : '#ccc',
                      border: '1px solid #999'
                    }} />
                    {insp.queenColor === 'Queenless' ? <span style={{color: '#D93025', fontWeight: 'bold'}}>Queenless</span> : (insp.queenSeen ? 'Seen' : 'Not Seen')}
                  </div>
                </td>
                <td style={{ padding: '15px' }}>{insp.framesOfBees || '-'}</td>
                <td style={{ padding: '15px' }}>{insp.framesOfFood || '-'}</td>
                <td style={{ padding: '15px' }}>{insp.miteCount || '0'}</td>
                <td style={{ padding: '15px', fontSize: '0.85rem', maxWidth: '300px', color: '#666' }}>
                  {insp.notes ? (insp.notes.length > 50 ? insp.notes.substring(0, 50) + '...' : insp.notes) : '-'}
                </td>
              </tr>
            ))}
            {filteredInspections.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '30px', textAlign: 'center', color: '#999' }}>No inspection records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          table { font-size: 10pt; }
          th, td { padding: 8px !important; }
          .no-print { display: none !important; }
          body { background: white !important; }
          .card { border: none !important; box-shadow: none !important; }
        }
      `}} />
    </div>
  );
};

export default GlobalReport;
