import React, { useEffect, useState } from 'react';
import { fetchHives, fetchApiaries, deleteApiary } from '../services/api';
import { Home, MapPin, Trash2, Edit, ClipboardList, Thermometer, Droplets, Utensils, AlertCircle } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [hives, setHives] = useState<any[]>([]);
  const [apiaries, setApiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchHives(), fetchApiaries()])
      .then(([hivesData, apiariesData]) => {
        setHives(hivesData);
        setApiaries(apiariesData);
        
        // 1. Calculate Reminders (Discovery of Queen Cells + 16 days)
        const allReminders: any[] = [];
        hivesData.forEach((hive: any) => {
          if (hive.inspections?.length > 0) {
            // Find the most recent inspection where queen cells were actually found
            const cellDiscoveryInspec = [...hive.inspections]
              .filter((i: any) => i.queenCellsFound)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

            // Fallback to latest inspection only if hive is marked Queenless but no cells recorded yet
            const baseInspec = cellDiscoveryInspec || 
              (hive.queenColor === 'Queenless' ? [...hive.inspections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null);

            if (baseInspec) {
              const checkDate = new Date(baseInspec.date);
              checkDate.setDate(checkDate.getDate() + 16);
              
              const daysDiff = Math.ceil((checkDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              // Only show if it's a "Queenless" context or cells were found
              if (hive.queenColor === 'Queenless' || cellDiscoveryInspec) {
                allReminders.push({
                  hiveId: hive.id,
                  hiveName: hive.name,
                  date: checkDate,
                  daysLeft: daysDiff,
                  reason: cellDiscoveryInspec ? 'Cells Found' : 'Marked Queenless'
                });
              }
            }
          }
        });
        setReminders(allReminders.sort((a, b) => a.date.getTime() - b.date.getTime()));

        // 2. Aggregate activities
        const allActivities: any[] = [];
        hivesData.forEach((hive: any) => {
          (hive.inspections || []).forEach((insp: any) => {
            allActivities.push({
              id: `insp-${insp.id}`,
              date: new Date(insp.date),
              type: 'Inspection',
              hiveName: hive.name,
              hiveId: hive.id,
              details: `Population: ${insp.population}`,
              icon: <ClipboardList size={18} color="#FFB900" />
            });
          });
          (hive.harvests || []).forEach((hv: any) => {
            allActivities.push({
              id: `hv-${hv.id}`,
              date: new Date(hv.date),
              type: 'Harvest',
              hiveName: hive.name,
              hiveId: hive.id,
              details: `${hv.productType}: ${hv.weight} kg/lb`,
              icon: <Droplets size={18} color="#FFB900" />
            });
          });
          (hive.treatments || []).forEach((tr: any) => {
            allActivities.push({
              id: `tr-${tr.id}`,
              date: new Date(tr.date),
              type: 'Treatment',
              hiveName: hive.name,
              hiveId: hive.id,
              details: tr.productUsed,
              icon: <Thermometer size={18} color="#4CAF50" />
            });
          });
          (hive.feedings || []).forEach((fd: any) => {
            allActivities.push({
              id: `fd-${fd.id}`,
              date: new Date(fd.date),
              type: 'Feeding',
              hiveName: hive.name,
              hiveId: hive.id,
              details: `${fd.type}: ${fd.amount}`,
              icon: <Utensils size={18} color="#2196F3" />
            });
          });
        });

        allActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
        setActivities(allActivities.slice(0, 10));
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteApiary = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the site "${name}"? This will only work if the site has no hives.`)) {
      try {
        await deleteApiary(id);
        loadData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete site. Ensure it has no hives first.');
      }
    }
  };

  if (loading) return <div className="container">Loading Dashboard...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Dashboard</h1>
        <Link to="/apiaries/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>+ Add New Site</Link>
      </div>

      {/* ⚠️ QUEENLESS REMINDERS SECTION */}
      {reminders.length > 0 && (
        <div className="card" style={{ background: '#FFF0F0', border: '1px solid #FFCDD2', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <AlertCircle size={24} color="#D32F2F" />
            <h2 style={{ margin: 0, color: '#D32F2F', fontSize: '1.4rem' }}>Queen Checks Required</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {reminders.map((rem, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '12px', 
                background: '#fff', 
                borderRadius: '8px',
                border: '1px solid #FFEBEE'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    <Link to={`/hives/${rem.hiveId}`} style={{ color: '#5D4037', textDecoration: 'none' }}>{rem.hiveName}</Link>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Check due: {rem.date.toLocaleDateString()}</div>
                </div>
                <div style={{ 
                  padding: '4px 10px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  background: rem.daysLeft <= 0 ? '#D32F2F' : '#FFF7E6',
                  color: rem.daysLeft <= 0 ? '#fff' : '#FFA000'
                }}>
                  {rem.daysLeft <= 0 ? 'DUE NOW' : `In ${rem.daysLeft} days`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#FFF7E6', padding: '10px', borderRadius: '50%' }}>
              <img src="/favicon.svg" alt="Bee Logo" style={{ width: '32px', height: '32px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#666' }}>Total Hives</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{hives.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#E6F4EA', padding: '10px', borderRadius: '50%' }}>
              <MapPin size={32} color="#4CAF50" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', color: '#666' }}>Apiaries</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{apiaries.length}</p>
            </div>
          </div>
          {apiaries.length > 0 && (
            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              {apiaries.map((api: any) => (
                <div key={api.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
                  <span style={{ fontSize: '0.9rem' }}>{api.name}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link 
                      to={`/apiaries/${api.id}/edit`}
                      style={{ color: '#2196F3', cursor: 'pointer', padding: '2px' }}
                      title="Edit Site"
                    >
                      <Edit size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDeleteApiary(api.id, api.name)}
                      style={{ background: 'none', border: 'none', color: '#D93025', cursor: 'pointer', padding: '2px' }}
                      title="Delete Site"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#E6F0FF', padding: '10px', borderRadius: '50%' }}>
              <Home size={32} color="#2196F3" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#666' }}>Active Status</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {hives.filter((h: any) => h.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>Yard Map</h2>
      <MapComponent apiaries={apiaries} />

      <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>Recent Activity</h2>
      <div className="card" style={{ padding: 0 }}>
        {activities.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activities.map((act, index) => (
              <div key={act.id} style={{ 
                padding: '15px 20px', 
                borderBottom: index === activities.length - 1 ? 'none' : '1px solid #EEE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ padding: '8px', background: '#F9F7F2', borderRadius: '8px' }}>
                    {act.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{act.type}: <Link to={`/hives/${act.hiveId}`} style={{ color: '#5D4037', textDecoration: 'none' }}>{act.hiveName}</Link></div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{act.details}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#999', fontWeight: 500 }}>
                  {act.date.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No recent activity to show yet. Start by adding an inspection!
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
