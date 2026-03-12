# FeelsLikeAnArbysNight — Design Spec

## Overview

A single-page web app that uses the browser's geolocation API to find and display the nearest Arby's restaurants on a Google Map. Themed around the Seinfeld character David Puddy and his iconic line "Feels like an Arby's night."

Public webpage, no auth. Anyone can see and use it.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS with design tokens as CSS custom properties
- **Components:** ShadCN UI
- **Maps:** Google Maps JavaScript API + Google Places API
- **Local Dev:** Docker + Docker Compose
- **Production:** Vercel
- **Language:** TypeScript

## Architecture

```
Browser (client)
  ├── Gets user location via Navigator.geolocation API
  ├── Renders Google Map via @react-google-maps/api
  ├── Calls /api/nearby-arbys?lat=X&lng=Y
  │
Next.js API Route (/api/nearby-arbys)
  ├── Receives lat/lng
  ├── Calls Google Places API (nearbySearch, keyword: "Arby's", radius: 16093m / ~10 miles)
  ├── Returns JSON array of locations
  │
Google Maps Platform
  ├── Maps JavaScript API (renders the map)
  └── Places API (finds Arby's locations)
```

- Places API key stays server-side only (never exposed to client)
- Maps JavaScript API key is client-side, restricted by HTTP referrer
- Two separate API keys (or one key with both APIs enabled, restricted appropriately)
- Environment variables via `.env.local` (dev) and Vercel env vars (prod)

## Page Layout

Single page with three sections, all visible at once:

### Nav Bar
- Minimal: small Puddy SVG icon on the left, dark/light mode toggle on the right
- Thin red accent border on the bottom

### Hero Section
- Large Puddy SVG icon (clickable — plays the "Feels like an Arby's night" audio clip from the show)
- App title: "Feels Like An **Arby's** Night" — "Arby's" in accent red
- Tagline: "Find your nearest Arby's. Yeah, that's right."
- No speech bubble — clicking Puddy only plays audio

### Map Section
- Google Map filling the width
- Custom Puddy face SVG markers for each Arby's location
- Blue dot for user's location
- Header above map showing result count ("3 locations found")
- Info window on marker click with restaurant name + directions link

### Location Cards
- Listed below the map
- Each card shows: restaurant name, distance, hours
- "Directions" link opens Google Maps navigation in a new tab

## David Puddy SVG

Custom SVG illustration of David Puddy's face with NJ Devils face paint (red/black "D" pattern from the show). Stylized caricature to match the modern app aesthetic.

Used in three sizes:
- **`lg`** — Hero icon (clickable, plays audio)
- **`sm`** — Google Maps custom markers
- **`xs`** — Nav bar icon

## Design Tokens

CSS custom properties in `tokens.css`, integrated into Tailwind config as first-class colors (e.g., `bg-surface`, `text-accent-red`, `border-border`). Values swap between dark/light mode automatically — no `dark:` prefix needed.

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| `--background` | `#0d0d0d` | `#faf9f7` |
| `--surface` | `#1a1a1a` | `#ffffff` |
| `--surface-elevated` | `#2a2a2a` | `#f5f4f2` |
| `--border` | `#333333` | `#e0ddd8` |
| `--text-primary` | `#ffffff` | `#1a1a1a` |
| `--text-secondary` | `#888888` | `#666666` |
| `--accent-red` | `#c41e3a` | `#c41e3a` |
| `--accent-red-dark` | `#8b0000` | `#8b0000` |
| `--accent-warm` | `#d4956a` | `#b8784f` |
| `--user-location` | `#4a90d9` | `#2563eb` |

### Tailwind Integration

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      background: 'var(--background)',
      surface: 'var(--surface)',
      'surface-elevated': 'var(--surface-elevated)',
      border: 'var(--border)',
      'accent-red': 'var(--accent-red)',
      'accent-red-dark': 'var(--accent-red-dark)',
      'accent-warm': 'var(--accent-warm)',
      'user-location': 'var(--user-location)',
    },
  },
}
```

## Typography

- **Body:** Inter (clean, modern)
- **Display/Title:** Bebas Neue (bold condensed, retro 90s Seinfeld-era feel)

## Animations

- **Puddy hero icon:** Subtle pulse glow on hover, scale bounce on click when audio plays
- **Map markers:** Fade-in with slight bounce when locations load
- **Location cards:** Staggered slide-up on appearance
- **Theme toggle:** Smooth color transitions via CSS `transition` on all themed properties

## Components

| Component | Description |
|-----------|-------------|
| `PuddyIcon` | Custom SVG component. Three sizes: `lg` (hero), `sm` (map marker), `xs` (nav). Hero version has hover glow + click handler for audio playback. |
| `ThemeToggle` | ShadCN Switch/Toggle in the nav. Toggles `dark`/`light` class on `<html>`. Persists preference to `localStorage`. |
| `ArbysMap` | Wraps `@react-google-maps/api`. Renders Google Map with dark/light styled map JSON. Custom markers using `AdvancedMarkerElement` with `PuddyIcon` sm rendered as inline SVG. Info windows on marker click showing restaurant name + directions link. |
| `LocationCard` | ShadCN Card variant. Shows restaurant name, distance, hours, "Directions" link (opens Google Maps in new tab). Staggered slide-up animation on load. |
| `LocationList` | Container for `LocationCard` components. Shows loading skeleton while API call is in flight. |
| `LocationPermission` | Handles the browser geolocation flow. Shows a friendly message if permission is denied. |

## Interaction Flow

1. Page loads → hero visible, map shows default view (zoomed out US)
2. Browser requests geolocation permission automatically
3. If granted → calls `/api/nearby-arbys` with coords → map zooms to user → Puddy markers appear with bounce animation → location cards slide up below
4. If denied → map stays default, message shown in the location list area
5. User clicks Puddy hero icon → audio plays
6. User clicks a map marker → info window with name + directions
7. User clicks "Directions" on a card → opens Google Maps in new tab

## Error States

- **API failure:** "Couldn't find nearby Arby's. Try again?" with retry button
- **No results:** "No Arby's found nearby. Puddy would not be pleased."
- **Location denied:** Friendly message explaining location is needed to find nearby restaurants

## API Rate Limiting

The `/api/nearby-arbys` route applies basic rate limiting: max 60 requests per minute per IP using an in-memory store. This prevents accidental cost spikes from the Google Places API. Sufficient for a hobby project; no external rate-limiting service needed.

## Accessibility

- Puddy SVG includes `role="img"` and `aria-label` describing the character
- Hero Puddy icon has `role="button"` and `aria-label="Play audio clip"`
- Map markers are supplemented by the location card list below (keyboard-accessible)
- Location cards are focusable with keyboard navigation
- Theme toggle is a labeled ShadCN switch with proper ARIA attributes
- Color contrast ratios meet WCAG AA for all text/background token pairs

## Audio Clip

The `puddy-audio.mp3` is a short clip from the Seinfeld TV show. This is a personal hobby project, not a commercial product. The user will source the audio file themselves and place it in `public/`.

## Environment Variables

| Variable | Used By | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Client | Maps JavaScript API key (restricted by HTTP referrer) |
| `GOOGLE_PLACES_API_KEY` | Server only | Places API key (never exposed to client) |

## Docker

- **Dockerfile:** Multi-stage build (deps → build → run), Node 20 Alpine
- **docker-compose.yml:** Single service, mounts source code as volume for hot reload, exposes port 3000, passes env vars from `.env.local`

## Vercel Deployment

- Standard Next.js deployment, no Docker needed
- Environment variables set in Vercel dashboard
- No database, no special build steps

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, theme provider, fonts
│   │   ├── page.tsx            # Single page — hero + map + list
│   │   └── api/
│   │       └── nearby-arbys/
│   │           └── route.ts    # Places API proxy
│   ├── components/
│   │   ├── puddy-icon.tsx
│   │   ├── arbys-map.tsx
│   │   ├── location-card.tsx
│   │   ├── location-list.tsx
│   │   ├── location-permission.tsx
│   │   ├── theme-toggle.tsx
│   │   └── ui/                 # ShadCN components
│   ├── lib/
│   │   └── google-places.ts    # Places API client
│   └── styles/
│       └── tokens.css          # Design tokens as CSS variables
├── public/
│   └── puddy-audio.mp3         # Audio clip
├── Dockerfile
├── docker-compose.yml
├── .env.local.example
└── tailwind.config.ts
```
