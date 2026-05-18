import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import HiveList from './pages/HiveList';
import HiveDetail from './pages/HiveDetail';
import InspectionForm from './pages/InspectionForm';
import HiveForm from './pages/HiveForm';
import ApiaryForm from './pages/ApiaryForm';
import HarvestForm from './pages/HarvestForm';
import TreatmentForm from './pages/TreatmentForm';
import FeedingForm from './pages/FeedingForm';
import GlobalReport from './pages/GlobalReport';
import Wiki from './pages/Wiki';
import './styles/global.css';
import 'leaflet/dist/leaflet.css';
import { CloudOff, LayoutDashboard, Bug, FileText, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Router>
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/" className="navbar-brand">
              <img src="/favicon.svg" alt="Bee Logo" style={{ width: '40px', height: '40px' }} />
              <span>BeeKeeper's Log</span>
            </Link>
            {isOffline && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px', 
                background: '#FFF0F0', 
                color: '#D93025', 
                padding: '4px 10px', 
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                <CloudOff size={14} />
                Offline
              </div>
            )}
          </div>
          <div className="desktop-nav" style={{ display: 'flex', gap: '20px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#666', fontWeight: 600 }}>Dashboard</Link>
            <Link to="/hives" style={{ textDecoration: 'none', color: '#666', fontWeight: 600 }}>Hives</Link>
            <Link to="/reports" style={{ textDecoration: 'none', color: '#666', fontWeight: 600 }}>Reports</Link>
            <Link to="/wiki" style={{ textDecoration: 'none', color: '#666', fontWeight: 600 }}>Wiki</Link>
          </div>
        </div>
      </nav>

      {/* Bottom Nav for Mobile */}
      <div className="bottom-nav">
        <Link to="/" className="bottom-nav-item">
          <LayoutDashboard size={24} />
          <span>Home</span>
        </Link>
        <Link to="/hives" className="bottom-nav-item">
          <Bug size={24} />
          <span>Hives</span>
        </Link>
        <Link to="/reports" className="bottom-nav-item">
          <FileText size={24} />
          <span>Reports</span>
        </Link>
        <Link to="/wiki" className="bottom-nav-item">
          <BookOpen size={24} />
          <span>Wiki</span>
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<GlobalReport />} />
        <Route path="/wiki" element={<Wiki />} />
        <Route path="/apiaries/new" element={<ApiaryForm />} />
        <Route path="/apiaries/:id/edit" element={<ApiaryForm />} />
        <Route path="/hives" element={<HiveList />} />
        <Route path="/hives/new" element={<HiveForm />} />
        <Route path="/hives/:id/edit" element={<HiveForm />} />
        <Route path="/hives/:id" element={<HiveDetail />} />
        <Route path="/hives/:id/inspect" element={<InspectionForm />} />
        <Route path="/hives/:id/inspect/:inspId/edit" element={<InspectionForm />} />
        <Route path="/hives/:id/harvest" element={<HarvestForm />} />
        <Route path="/hives/:id/treatment" element={<TreatmentForm />} />
        <Route path="/hives/:id/feed" element={<FeedingForm />} />
      </Routes>
    </Router>
  );
}

export default App;
