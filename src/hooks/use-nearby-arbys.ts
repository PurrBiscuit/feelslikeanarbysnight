"use client";

import { useState, useEffect, useCallback } from "react";
import type { ArbysLocation } from "@/lib/google-places";

interface NearbyArbysState {
  locations: ArbysLocation[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNearbyArbys(
  userLocation: { lat: number; lng: number } | null
): NearbyArbysState {
  const [locations, setLocations] = useState<ArbysLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    if (!userLocation) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/nearby-arbys?lat=${userLocation.lat}&lng=${userLocation.lng}`
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to fetch locations.");
      }

      const data = await res.json();
      setLocations(data.locations);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't find nearby Arby's. Try again?"
      );
    } finally {
      setIsLoading(false);
    }
  }, [userLocation]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { locations, isLoading, error, refetch: fetchLocations };
}
