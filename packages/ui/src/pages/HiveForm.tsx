import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { createHive, updateHive, fetchApiaries, fetchHiveById, uploadImage } from '../services/api';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Camera } from 'lucide-react';

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

const HiveForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [apiaries, setApiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [formData, setFormData] = useState({
    name: '',
    type: 'National',
    installDate: new Date().toISOString().split('T')[0],
    apiaryId: '',
    queenColor: 'Unmarked',
    latitude: '',
    longitude: '',
    notes: '',
    imagePath: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Fetch apiaries first
    fetchApiaries().then(data => {
      setApiaries(data);
      if (!isEdit && data.length > 0) {
        setFormData(prev => ({ ...prev, apiaryId: data[0].id }));
        if (data[0].latitude && data[0].longitude) {
          setMapPosition([data[0].latitude, data[0].longitude]);
        }
      }
    });

    // If editing, fetch existing hive data
    if (isEdit && id) {
      fetchHiveById(id).then(hive => {
        setFormData({
          name: hive.name,
          type: hive.type,
          installDate: new Date(hive.installDate).toISOString().split('T')[0],
          apiaryId: hive.apiaryId,
          queenColor: hive.queenColor || 'Unmarked',
          latitude: hive.latitude?.toString() || '',
          longitude: hive.longitude?.toString() || '',
          notes: hive.notes || '',
          imagePath: hive.imagePath || ''
        });
        if (hive.imagePath) {
          setImagePreview(hive.imagePath);
        }
        if (hive.latitude && hive.longitude) {
          setMapPosition([hive.latitude, hive.longitude]);
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
      let finalImagePath = formData.imagePath;

      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        finalImagePath = uploadRes.imageUrl;
      }

      const data = {
        ...formData,
        imagePath: finalImagePath,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };

      if (isEdit && id) {
        await updateHive(id, data);
        navigate(`/hives/${id}`);
      } else {
        await createHive(data);
        navigate('/hives');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save hive');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
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
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'latitude' || name === 'longitude') {
      const lat = name === 'latitude' ? parseFloat(value) : parseFloat(formData.latitude);
      const lng = name === 'longitude' ? parseFloat(value) : parseFloat(formData.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapPosition([lat, lng]);
      }
    }
  };

  if (loading) return <div className="container">Loading hive data...</div>;

  const initialCenter: [number, number] = mapPosition || [51.505, -0.09];

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to={isEdit ? `/hives/${id}` : "/hives"} style={{ color: '#666', textDecoration: 'none' }}>
          &larr; Back to {isEdit ? 'Hive' : 'Hives'}
        </Link>
        <h1 style={{ marginTop: '10px' }}>{isEdit ? 'Edit Hive' : 'Add New Hive'}</h1>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Hive Photo</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', padding: '20px', border: '2px dashed #ddd', borderRadius: '12px', background: '#f9f9f9' }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
              ) : (
                <Camera size={48} color="#ccc" />
              )}
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                onChange={handleImageChange} 
                id="hive-image-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="hive-image-upload" className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                {imagePreview ? 'Change Photo' : 'Take/Choose Photo'}
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Hive Name / ID</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="e.g. Hive 1, Blue Box"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              required 
            />
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Hive Type</label>
              <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option>National</option>
                <option>WBC</option>
                <option>Smith</option>
                <option>Commercial</option>
                <option>Langstroth</option>
                <option>Top Bar</option>
                <option>Warre</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Install Date</label>
              <input 
                type="date" 
                name="installDate" 
                value={formData.installDate} 
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                required 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Queen Marking Color</label>
            <select 
              name="queenColor" 
              value={formData.queenColor} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option>Unmarked</option>
              <option value="Queenless">-- QUEENLESS --</option>
              <option>White (Year 1, 6)</option>
              <option>Yellow (Year 2, 7)</option>
              <option>Red (Year 3, 8)</option>
              <option>Green (Year 4, 9)</option>
              <option>Blue (Year 5, 0)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Site (Apiary)</label>
            <select 
              name="apiaryId" 
              value={formData.apiaryId} 
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              required
            >
              {apiaries.length === 0 && <option value="">No sites found. Add a site first!</option>}
              {apiaries.map(apiary => (
                <option key={apiary.id} value={apiary.id}>{apiary.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>Hive Specific Location (Optional)</label>
            
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
              Use Current Location
            </button>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Notes</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange}
              rows={3}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', fontSize: '1.1rem' }}
            disabled={apiaries.length === 0}
          >
            {isEdit ? 'Update Hive' : 'Save Hive'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HiveForm;
