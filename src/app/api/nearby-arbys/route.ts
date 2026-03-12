import { NextRequest, NextResponse } from "next/server";
import { searchNearbyArbys } from "@/lib/google-places";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, remaining } = rateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a minute." },
      { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  }

  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "Valid lat and lng query parameters are required." },
      { status: 400 }
    );
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json(
      { error: "lat must be -90..90 and lng must be -180..180." },
      { status: 400 }
    );
  }

  try {
    const locations = await searchNearbyArbys(lat, lng);
    return NextResponse.json(
      { locations },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (error) {
    console.error("Error fetching nearby Arby's:", error);
    return NextResponse.json(
      { error: "Failed to fetch nearby Arby's locations." },
      { status: 500 }
    );
  }
}
