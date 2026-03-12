# Feels Like An Arby's Night

A Seinfeld-inspired web app that uses your location to find nearby Arby's restaurants on a map. Because sometimes, it just feels like an Arby's night. Yeah, that's right.

## What Is This

Click David Puddy's face. He'll tell you about the Devils. Then find an Arby's near you. It's what Puddy would want.

- Real-time geolocation to find nearby Arby's locations
- Interactive Google Map with Arby's logo markers
- Click a location card to zoom in on the map
- Audio clips from the show because why not
- Dark mode for those late night Arby's cravings

## Getting Started

1. Copy `.env.local.example` to `.env.local` and add your Google Maps/Places API keys:

```bash
cp .env.local.example .env.local
```

2. Fire it up:

```bash
docker-compose up
```

3. Open [http://localhost:3000](http://localhost:3000) and find your nearest Arby's.

## Tech Stack

- Next.js + Tailwind + ShadCN
- Google Maps + Places API
- Docker
- Seinfeld quotes (the most important dependency)
