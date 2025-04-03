import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ScamEvent, ScamType } from '../types';
import { AlertTriangle, MapPin, Calendar, Info, Shield } from 'lucide-react';

// Add HeatMap support (if we use it)
declare module 'leaflet' {
  namespace HeatMap {
    function create(options?: any): any;
    class HeatLayer extends L.Layer {
      constructor(latlngs: L.LatLngExpression[], options?: any);
      setLatLngs(latlngs: L.LatLngExpression[]): this;
      addLatLng(latlng: L.LatLngExpression): this;
      setOptions(options: any): this;
      redraw(): this;
    }
  }
}

// Setup for HeatMap
let HeatLayer: any = null;
try {
  // Import might fail in some environments
  import('leaflet.heat').then((module) => {
    HeatLayer = module.default || L.heatLayer;
  }).catch(err => {
    console.error('Error loading heatmap layer:', err);
  });
} catch (e) {
  console.warn('leaflet.heat may not be available:', e);
}

// Fix Leaflet marker icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface ScamMapProps {
  scamEvents: ScamEvent[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  showHeatMap?: boolean;
  onMarkerClick?: (event: ScamEvent) => void;
  filter?: {
    scamTypes?: ScamType[];
    onlyVerified?: boolean;
  };
}

// Helper to format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get color based on scam type
const getScamTypeColor = (scamType?: ScamType): string => {
  const colorMap: Record<ScamType, string> = {
    'Tourist Trap': '#EF4444', // red-500
    'Overcharging': '#F59E0B', // yellow-500
    'Fake Products': '#10B981', // green-500
    'Pickpocketing': '#3B82F6', // blue-500
    'Taxi Scam': '#8B5CF6', // purple-500
    'Fake Officials': '#EC4899', // pink-500
    'Counterfeit Currency': '#F97316', // orange-500
    'Accommodation Scam': '#14B8A6', // teal-500
    'ATM Fraud': '#6366F1', // indigo-500
    'Distraction Theft': '#A855F7', // violet-500
    'Other': '#6B7280', // gray-500
  };

  return scamType ? colorMap[scamType] : '#6B7280';
};

// HeatMap layer component
const HeatMapLayer: React.FC<{ scamEvents: ScamEvent[] }> = ({ scamEvents }) => {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!HeatLayer) return;

    // Clean up any existing heat layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Create points array for heat map
    const heatPoints = scamEvents
      .filter(event => event.latitude && event.longitude)
      .map(event => [
        event.latitude,
        event.longitude,
        // Optionally weight by recency - more recent events have more intensity
        event.created_at ? 
          Math.max(0.3, 1 - (Date.now() - new Date(event.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)) 
          : 0.5
      ]);

    if (heatPoints.length > 0) {
      heatLayerRef.current = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
      }).addTo(map);
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, scamEvents]);

  return null;
};

const ScamMap: React.FC<ScamMapProps> = ({
  scamEvents,
  center = [20, 0], // Default to a world view
  zoom = 2,
  height = '600px',
  showHeatMap = false,
  onMarkerClick,
  filter
}) => {
  // Apply filters to scam events - ensure scam_type is available
  const filteredEvents = scamEvents.filter(event => {
    // Ensure scam_type has a value
    const eventScamType = event.scam_type || 'Other';
    
    // Filter by scam type if specified
    if (filter?.scamTypes?.length) {
      if (!filter.scamTypes.includes(eventScamType as ScamType)) {
        return false;
      }
    }
    
    // Filter by verification status if needed
    if (filter?.onlyVerified && !event.verified) {
      return false;
    }
    
    return true;
  });

  // Custom marker icon for scam events
  const createScamIcon = (scamType?: ScamType, verified: boolean = false): L.DivIcon => {
    const color = getScamTypeColor(scamType || 'Other');
    return L.divIcon({
      className: 'custom-marker-icon',
      html: `
        <div style="
          background-color: ${color}; 
          width: 28px; 
          height: 28px; 
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
          ${verified ? '✓' : '!'}
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
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
        
        {/* Show heat map layer if enabled */}
        {showHeatMap && HeatLayer && filteredEvents.length > 0 && <HeatMapLayer scamEvents={filteredEvents} />}
        
        {/* Show markers for each scam event */}
        {filteredEvents
          .filter(event => event.latitude && event.longitude) // Only show events with coordinates
          .map((event) => (
            <Marker 
              key={event.id} 
              position={[event.latitude!, event.longitude!]}
              icon={createScamIcon(event.scam_type as ScamType, event.verified)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(event)
              }}
            >
              <Popup>
                <div className="text-gray-900 dark:text-white max-w-[300px]">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  
                  <div className="mt-2 flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">
                      Scam Type: <span className="font-medium">{event.scam_type || 'Other'}</span>
                    </span>
                  </div>
                  
                  <div className="mt-1 flex items-start">
                    <MapPin className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  
                  {event.start_date && (
                    <div className="mt-1 flex items-start">
                      <Calendar className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        {formatDate(event.start_date)}
                        {event.end_date && ` - ${formatDate(event.end_date)}`}
                      </span>
                    </div>
                  )}
                  
                  {event.description && (
                    <div className="mt-1 flex items-start">
                      <Info className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm line-clamp-3">{event.description}</span>
                    </div>
                  )}
                  
                  <div className="mt-2 flex items-center">
                    <Shield className={`h-4 w-4 ${event.verified ? 'text-green-500' : 'text-gray-400'} mr-2`} />
                    <span className="text-xs">
                      {event.verified ? 'Verified Report' : 'Unverified Report'}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'Scam' : 'Scams'} Reported
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScamMap;