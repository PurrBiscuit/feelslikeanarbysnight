"use client";

import { LocationCard } from "@/components/location-card";
import type { ArbysLocation } from "@/lib/google-places";

interface LocationListProps {
  locations: ArbysLocation[];
  userLocation: { lat: number; lng: number } | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectLocation: (id: string) => void;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-surface-elevated rounded w-1/3 mb-2" />
          <div className="h-3 bg-surface-elevated rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function LocationList({ locations, userLocation, isLoading, error, onRetry, onSelectLocation }: LocationListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-accent-red text-white rounded-lg hover:bg-accent-red-dark transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary">
          No Arby&apos;s found nearby. Puddy would not be pleased.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {locations.map((location, index) => (
        <LocationCard
          key={location.id}
          location={location}
          userLocation={userLocation}
          index={index}
          onSelect={() => onSelectLocation(location.id)}
        />
      ))}
    </div>
  );
}
