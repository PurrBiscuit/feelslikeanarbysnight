"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ArbysLocation } from "@/lib/google-places";

interface LocationCardProps {
  location: ArbysLocation;
  userLocation: { lat: number; lng: number } | null;
  index: number;
  onSelect: () => void;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function LocationCard({ location, userLocation, index, onSelect }: LocationCardProps) {
  const distance = userLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, location.lat, location.lng)
    : null;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;

  return (
    <Card
      className="bg-surface border-border hover:bg-surface-elevated transition-colors duration-200 animate-slide-up cursor-pointer shadow-md"
      onClick={onSelect}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "both",
      }}
    >
      <CardContent className="flex items-center justify-between px-4 py-2">
        <div>
          {location.address && (
            <h3 className="font-semibold text-text-primary text-sm">{location.address}</h3>
          )}
          <p className="text-text-secondary text-sm mt-0.5">
            {distance !== null && <span>{distance.toFixed(1)} mi · </span>}
            {location.openNow !== undefined && (
              <span className={location.openNow ? "text-green-500" : "text-red-500"}>
                {location.openNow ? "Open" : "Closed"}
              </span>
            )}
          </p>
          {location.hours && location.hours.length > 0 && (
            <p className="text-text-secondary text-sm mt-0.5 truncate max-w-[300px]">
              {location.hours[(new Date().getDay() + 6) % 7]}
            </p>
          )}
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-red text-sm font-semibold hover:text-accent-red-dark transition-colors whitespace-nowrap ml-4"
        >
          Directions →
        </a>
      </CardContent>
    </Card>
  );
}
