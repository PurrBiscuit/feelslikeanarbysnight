"use client";

interface LocationPermissionProps {
  error: string;
}

export function LocationPermission({ error }: LocationPermissionProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-4xl mb-4">📍</div>
        <h2 className="text-text-primary font-semibold text-lg mb-2">
          Location Access Needed
        </h2>
        <p className="text-text-secondary text-sm">{error}</p>
        <p className="text-text-secondary text-xs mt-4">
          Enable location access in your browser settings and refresh the page.
        </p>
      </div>
    </div>
  );
}
