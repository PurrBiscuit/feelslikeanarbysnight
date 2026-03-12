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
            <span className="font-display text-lg md:text-xl tracking-wide">
              <span className="text-text-primary">FEELS LIKE AN </span>
              <span className="text-accent-red">ARBY&apos;S</span>
              <span className="text-text-primary"> NIGHT</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.arbys.com/menu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-red/10 text-accent-red hover:bg-accent-red/20 transition-colors text-sm font-medium"
            >
              <img src="/arbys-marker.png" alt="" width={18} height={16} />
              Menu
            </a>
            <a
              href="https://github.com/PurrBiscuit/feelslikeanarbysnight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="GitHub repository"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-12 md:py-16 px-4">
        <div className="flex justify-center mb-6">
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
          isLoading={isLoading}
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
          />
        )}
      </main>
    </div>
  );
}
