"use client";

import { PuddyIcon } from "@/components/puddy-icon";
import { ThemeToggle } from "@/components/theme-toggle";
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

  return (
    <div className="min-h-screen bg-background">
      {/* Nav Bar */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b-2 border-accent-red">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PuddyIcon size="xs" />
            <h1 className="font-display text-lg md:text-xl tracking-wide">
              <span className="text-text-primary">FEELS LIKE AN </span>
              <span className="text-accent-red">ARBY&apos;S</span>
              <span className="text-text-primary"> NIGHT</span>
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-12 md:py-16 px-4">
        <div className="flex justify-center mb-6">
          <PuddyIcon size="lg" playAudio />
        </div>
        <p className="text-text-secondary mt-3 text-sm md:text-base">
          Find your nearest Arby&apos;s. Yeah, that&apos;s right.
        </p>
      </section>

      {/* Map + Location Cards */}
      <main className="max-w-5xl mx-auto px-4 pb-16 space-y-6">
        <ArbysMap
          locations={locations}
          userLocation={userLocation}
          isLoading={isLoading}
        />

        {geoError && !arbysError ? (
          <LocationPermission error={geoError} />
        ) : (
          <LocationList
            locations={locations}
            userLocation={userLocation}
            isLoading={isLoading}
            error={arbysError}
            onRetry={refetch}
          />
        )}
      </main>
    </div>
  );
}
