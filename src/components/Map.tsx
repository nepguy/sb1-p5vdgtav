import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Navigation } from 'lucide-react';

// Fix Leaflet marker icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapLocation {
  id: string;
  title: string;
  safetyLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  position: [number, number]; // [latitude, longitude]
  alertCount: number;
}

interface SafetyMapProps {
  locations?: MapLocation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const getSafetyColor = (safetyLevel: MapLocation['safetyLevel']): string => {
  switch (safetyLevel) {
    case 'Very High':
    case 'High':
      return '#10B981'; // green-500
    case 'Medium':
      return '#F59E0B'; // yellow-500
    case 'Low':
      return '#EF4444'; // red-500
    default:
      return '#3B82F6'; // blue-500
  }
};

const SafetyMap: React.FC<SafetyMapProps> = ({
  locations = [],
  center = [51.505, -0.09], // London as default center
  zoom = 3,
  height = '400px'
}) => {
  // Custom marker icon for safety levels
  const createSafetyIcon = (safetyLevel: MapLocation['safetyLevel']): L.DivIcon => {
    return L.divIcon({
      className: 'custom-marker-icon',
      html: `
        <div style="
          background-color: ${getSafetyColor(safetyLevel)}; 
          width: 24px; 
          height: 24px; 
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 5px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">
          ${safetyLevel === 'Very High' || safetyLevel === 'High' ? '✓' : '!'}
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => (
          <Marker 
            key={location.id} 
            position={location.position}
            icon={createSafetyIcon(location.safetyLevel)}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{location.title}</h3>
                <p className="text-sm mt-1">
                  Safety Level: <span className="font-medium" style={{ color: getSafetyColor(location.safetyLevel) }}>{location.safetyLevel}</span>
                </p>
                <p className="text-sm">
                  Active Alerts: {location.alertCount}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10">
        <Navigation className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
  );
};

export default SafetyMap;