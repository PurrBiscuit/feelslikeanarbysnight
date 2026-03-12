"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PuddyIcon } from "@/components/puddy-icon";
import { NavItems } from "@/components/nav-items";
import { ArbysMap } from "@/components/arbys-map";
import { LocationList } from "@/components/location-list";
import { LocationPermission } from "@/components/location-permission";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useNearbyArbys } from "@/hooks/use-nearby-arbys";

export default function Home() {
  const { location: userLocation, error: geoError } = useGeolocation();
  const {
    locations,
    isLoading,
    error: arbysError,
    refetch,
  } = useNearbyArbys(userLocation);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [centerOnSelect, setCenterOnSelect] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/puddy_audio_clean.mp3");
    audio.preload = "auto";
    audioRef.current = audio;
  }, []);

  const playAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);

  const handleSelectLocation = useCallback((id: string | null) => {
    if (id) playAudio();
    setCenterOnSelect(false);
    setSelectedLocationId(id);
  }, [playAudio]);

  const handleCardSelect = useCallback((id: string) => {
    playAudio();
    setCenterOnSelect(true);
    setSelectedLocationId(id);
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [playAudio]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav Bar */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b-2 border-accent-red">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PuddyIcon size="xs" />
            <span className="font-display text-sm md:text-xl tracking-wide">
              <span className="text-text-primary">FEELS LIKE AN </span>
              <span className="text-accent-red">ARBY&apos;S</span>
              <span className="text-text-primary"> NIGHT</span>
            </span>
          </div>
          <NavItems />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-12 md:py-16 px-4">
        <div className="flex justify-center mb-6 max-w-[250px] md:max-w-none mx-auto">
          <PuddyIcon size="lg" playAudio />
        </div>
        <h1 className="font-display text-4xl md:text-6xl tracking-wide">
          <span className="text-text-primary">FEELS LIKE AN </span>
          <span className="text-accent-red">ARBY&apos;S</span>
          <span className="text-text-primary"> NIGHT</span>
        </h1>
        <p className="text-text-secondary mt-3 text-sm md:text-base">
          Find your nearest Arby&apos;s. Yeah, that&apos;s right.
        </p>
      </section>

      {/* Map + Location Cards */}
      <main className="max-w-5xl mx-auto px-4 pb-16 space-y-6">
        <ArbysMap
          locations={locations}
          userLocation={userLocation}
          selectedLocationId={selectedLocationId}
          onSelectLocation={handleSelectLocation}
          mapRef={mapRef}
          centerOnSelect={centerOnSelect}
        />

        <p className="text-text-secondary text-sm md:text-base text-center">
          {isLoading
            ? "Searching..."
            : locations.length === 0
              ? "No locations found nearby"
              : `${locations.length} location${locations.length !== 1 ? "s" : ""} found nearby`}
        </p>

        {geoError && !arbysError ? (
          <LocationPermission error={geoError} />
        ) : (
          <LocationList
            locations={locations}
            userLocation={userLocation}
            isLoading={isLoading}
            error={arbysError}
            onRetry={refetch}
            onSelectLocation={handleCardSelect}
          />
        )}
      </main>
    </div>
  );
}
