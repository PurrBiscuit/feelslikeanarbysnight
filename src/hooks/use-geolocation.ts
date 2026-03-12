"use client";

import { useState, useEffect, useRef } from "react";

interface GeolocationState {
  location: { lat: number; lng: number } | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  });
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!navigator.geolocation) {
      queueMicrotask(() => {
        setState({
          location: null,
          error: "Geolocation is not supported by your browser.",
          loading: false,
        });
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
      },
      (err) => {
        let message = "Unable to retrieve your location.";
        if (err.code === err.PERMISSION_DENIED) {
          message = "Location access denied. We need your location to find nearby Arby's.";
        }
        setState({
          location: null,
          error: message,
          loading: false,
        });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return state;
}
