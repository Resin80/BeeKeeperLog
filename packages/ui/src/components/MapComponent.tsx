import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix for default marker icons in React Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  apiaries: any[];
}

const MapComponent: React.FC<MapProps> = ({ apiaries }) => {
  const center: [number, number] = apiaries.length > 0 && apiaries[0].latitude
    ? [apiaries[0].latitude, apiaries[0].longitude] 
    : [51.505, -0.09];

  return (
    <div className="card" style={{ height: '400px', padding: 0, overflow: 'hidden' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {apiaries.map(apiary => (
          <React.Fragment key={apiary.id}>
            {apiary.latitude && apiary.longitude && (
              <Marker position={[apiary.latitude, apiary.longitude]}>
                <Popup>
                  <div style={{ padding: '5px' }}>
                    <strong style={{ fontSize: '1.1rem' }}>{apiary.name} (Site)</strong><br />
                    <span>{apiary.hives?.length || 0} Hives Total</span>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {apiary.hives?.map((hive: any) => (
              hive.latitude && hive.longitude && (
                <CircleMarker 
                  key={hive.id} 
                  center={[hive.latitude, hive.longitude]} 
                  radius={8}
                  pathOptions={{ color: '#FFB900', fillColor: '#FFB900', fillOpacity: 0.8 }}
                >
                  <Popup>
                    <div style={{ padding: '5px' }}>
                      <strong style={{ fontSize: '1.1rem' }}>{hive.name}</strong><br />
                      <span>Type: {hive.type}</span><br />
                      <Link to={`/hives/${hive.id}`} style={{ color: '#FFB900', fontWeight: 'bold' }}>View Details &rarr;</Link>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            ))}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
