"use client";

import { useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { PuddyIcon } from "@/components/puddy-icon";
import type { ArbysLocation } from "@/lib/google-places";

interface ArbysMapProps {
  locations: ArbysLocation[];
  userLocation: { lat: number; lng: number } | null;
  isLoading: boolean;
}

function ArbysMarker({ location }: { location: ArbysLocation }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [showInfo, setShowInfo] = useState(false);

  const handleClick = useCallback(() => {
    setShowInfo((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setShowInfo(false);
  }, []);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: location.lat, lng: location.lng }}
        onClick={handleClick}
        title={location.name}
      >
        <PuddyIcon size="sm" />
      </AdvancedMarker>

      {showInfo && (
        <InfoWindow anchor={marker} onClose={handleClose}>
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

export function ArbysMap({ locations, userLocation, isLoading }: ArbysMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "";

  const defaultCenter = userLocation ?? { lat: 39.8283, lng: -98.5795 };
  const defaultZoom = userLocation ? 12 : 4;

  return (
    <div className="w-full rounded-lg overflow-hidden border border-border">
      {/* Map header */}
      <div className="flex justify-between items-center px-4 py-2 bg-surface-elevated border-b border-border">
        <span className="font-semibold text-text-primary text-sm">
          Nearby Arby&apos;s
        </span>
        <span className="text-text-secondary text-xs">
          {isLoading
            ? "Searching..."
            : `${locations.length} location${locations.length !== 1 ? "s" : ""} found`}
        </span>
      </div>

      {/* Map - dark/light styling handled via Cloud-based Map Styling using the Map ID in Google Cloud Console */}
      <div className="h-[400px] md:h-[500px]">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
            mapId={mapId}
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            {/* User location marker */}
            {userLocation && (
              <AdvancedMarker position={userLocation}>
                <div className="w-4 h-4 bg-user-location rounded-full border-2 border-white shadow-lg" />
              </AdvancedMarker>
            )}

            {/* Arby's markers */}
            {locations.map((location) => (
              <ArbysMarker key={location.id} location={location} />
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
