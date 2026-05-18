import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { createApiary, updateApiary, fetchApiaries } from '../services/api';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) => {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} />
  );
};

const ApiaryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    notes: ''
  });

  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      fetchApiaries().then(apiaries => {
        const apiary = apiaries.find((a: any) => a.id === id);
        if (apiary) {
          setFormData({
            name: apiary.name,
            latitude: apiary.latitude?.toString() || '',
            longitude: apiary.longitude?.toString() || '',
            notes: apiary.notes || ''
          });
          if (apiary.latitude && apiary.longitude) {
            setMapPosition([apiary.latitude, apiary.longitude]);
          }
        }
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  // Sync map position back to form data
  useEffect(() => {
    if (mapPosition) {
      setFormData(prev => ({
        ...prev,
        latitude: mapPosition[0].toFixed(6),
        longitude: mapPosition[1].toFixed(6)
      }));
    }
  }, [mapPosition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };

      if (isEdit && id) {
        await updateApiary(id, data);
      } else {
        await createApiary(data);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to save site');
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error(error);
          let msg = "Could not get location.";
          if (window.location.protocol !== 'https:') {
            msg += " Mobile browsers require a secure (HTTPS) connection for location services.";
          } else {
            msg += " Please ensure location permissions are enabled.";
          }
          alert(msg);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update map marker if user types coordinates manually
    if (name === 'latitude' || name === 'longitude') {
      const lat = name === 'latitude' ? parseFloat(value) : parseFloat(formData.latitude);
      const lng = name === 'longitude' ? parseFloat(value) : parseFloat(formData.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapPosition([lat, lng]);
      }
    }
  };

  if (loading) return <div className="container">Loading site data...</div>;

  const initialCenter: [number, number] = mapPosition || [51.505, -0.09];

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
        <h1 style={{ marginTop: '10px' }}>{isEdit ? 'Edit Site' : 'Add New Site'}</h1>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Site Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="e.g. Back Garden, North Orchard"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>Location (Click map to set pin)</label>
            
            <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd', marginBottom: '10px' }}>
              <MapContainer center={initialCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <LocationMarker position={mapPosition} setPosition={setMapPosition} />
              </MapContainer>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="number" 
                step="any"
                name="latitude" 
                value={formData.latitude} 
                onChange={handleChange}
                placeholder="Latitude"
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
              <input 
                type="number" 
                step="any"
                name="longitude" 
                value={formData.longitude} 
                onChange={handleChange}
                placeholder="Longitude"
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>
            <button 
              type="button" 
              onClick={handleGetCurrentLocation}
              className="btn" 
              style={{ background: '#E6F0FF', color: '#2196F3', border: '1px solid #2196F3' }}
            >
              Get Current Location
            </button>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange}
              rows={4}
              placeholder="Describe the site environment..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>
            {isEdit ? 'Update Site' : 'Save Site'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApiaryForm;
