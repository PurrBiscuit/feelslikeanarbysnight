export interface ArbysLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  openNow?: boolean;
  hours?: string[];
  rating?: number;
}

const PLACES_TEXT_SEARCH_URL =
  "https://places.googleapis.com/v1/places:searchText";

export async function searchNearbyArbys(
  lat: number,
  lng: number
): Promise<ArbysLocation[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_PLACES_API_KEY is not configured");
  }

  const response = await fetch(PLACES_TEXT_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.currentOpeningHours,places.rating",
    },
    body: JSON.stringify({
      textQuery: "Arby's restaurant",
      maxResultCount: 20,
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 16093.0,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Places API error:", response.status, errorBody);
    throw new Error(`Places API returned ${response.status}`);
  }

  const data = await response.json();

  if (!data.places) {
    return [];
  }

  return data.places.map(
    (place: {
      id: string;
      displayName?: { text: string };
      formattedAddress?: string;
      location?: { latitude: number; longitude: number };
      currentOpeningHours?: { openNow: boolean; weekdayDescriptions?: string[] };
      rating?: number;
    }) => ({
      id: place.id,
      name: place.displayName?.text ?? "Arby's",
      address: place.formattedAddress ?? "",
      lat: place.location?.latitude ?? 0,
      lng: place.location?.longitude ?? 0,
      openNow: place.currentOpeningHours?.openNow,
      hours: place.currentOpeningHours?.weekdayDescriptions ?? [],
      rating: place.rating,
    })
  );
}
