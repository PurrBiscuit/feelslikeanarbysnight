"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useMap,
} from "@vis.gl/react-google-maps";
import Image from "next/image";
import type { ArbysLocation } from "@/lib/google-places";

interface ArbysMapProps {
  locations: ArbysLocation[];
  userLocation: { lat: number; lng: number } | null;
  selectedLocationId: string | null;
  onSelectLocation: (id: string | null) => void;
  mapRef?: React.RefObject<HTMLDivElement | null>;
  centerOnSelect?: boolean;
}

function ArbysMarker({
  location,
  isOpen,
  onOpen,
  onClose,
}: {
  location: ArbysLocation;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: location.lat, lng: location.lng }}
        onClick={onOpen}
        title={location.name}
      >
        <div className="animate-fade-in-bounce">
          <Image src="/arbys-marker.png" alt="Arby's" width={46} height={40} />
        </div>
      </AdvancedMarker>

      {isOpen && (
        <InfoWindow anchor={marker} onClose={onClose} onCloseClick={onClose} headerDisabled shouldFocus={false}>
          <div className="p-2 text-sm">
            <h3 className="font-semibold text-gray-900">{location.name}</h3>
            <p className="text-gray-600 text-xs mt-1">{location.address}</p>
            {location.openNow !== undefined && (
              <p className={`text-xs mt-1 font-medium ${location.openNow ? "text-green-600" : "text-red-600"}`}>
                {location.openNow ? "Open now" : "Closed"}
              </p>
            )}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs mt-2 inline-block text-blue-600 hover:underline font-medium"
            >
              Get directions →
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function AutoFitBounds({
  locations,
  userLocation,
}: {
  locations: ArbysLocation[];
  userLocation: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (!map || locations.length === 0 || hasFitted.current) return;

    const top3 = locations.slice(0, 3);
    const bounds = new google.maps.LatLngBounds();

    if (userLocation) {
      bounds.extend(userLocation);
    }

    for (const loc of top3) {
      bounds.extend({ lat: loc.lat, lng: loc.lng });
    }

    map.fitBounds(bounds, 50);
    hasFitted.current = true;
  }, [map, locations, userLocation]);

  return null;
}

function CenterOnLocation({
  locations,
  selectedLocationId,
  shouldCenter,
}: {
  locations: ArbysLocation[];
  selectedLocationId: string | null;
  shouldCenter: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedLocationId || !shouldCenter) return;
    const loc = locations.find((l) => l.id === selectedLocationId);
    if (loc) {
      map.panTo({ lat: loc.lat, lng: loc.lng });
      map.setZoom(15);
    }
  }, [map, locations, selectedLocationId, shouldCenter]);

  return null;
}

export function ArbysMap({ locations, userLocation, selectedLocationId, onSelectLocation, mapRef, centerOnSelect }: ArbysMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "";

  const defaultCenter = userLocation ?? { lat: 39.8283, lng: -98.5795 };
  const defaultZoom = userLocation ? 12 : 4;

  const handleMapClick = useCallback(() => {
    onSelectLocation(null);
  }, [onSelectLocation]);

  return (
    <div ref={mapRef} className="w-full rounded-lg overflow-hidden border border-border">
      <div className="h-[400px] md:h-[500px]">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
            mapId={mapId}
            gestureHandling="greedy"
            disableDefaultUI={false}
            onClick={handleMapClick}
          >
            <AutoFitBounds locations={locations} userLocation={userLocation} />
            <CenterOnLocation locations={locations} selectedLocationId={selectedLocationId} shouldCenter={centerOnSelect ?? false} />

            {/* User location marker */}
            {userLocation && (
              <AdvancedMarker position={userLocation}>
                <div className="w-4 h-4 bg-user-location rounded-full border-2 border-white shadow-lg" />
              </AdvancedMarker>
            )}

            {/* Arby's markers */}
            {locations.map((location) => (
              <ArbysMarker
                key={location.id}
                location={location}
                isOpen={selectedLocationId === location.id}
                onOpen={() => onSelectLocation(location.id)}
                onClose={() => onSelectLocation(null)}
              />
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
