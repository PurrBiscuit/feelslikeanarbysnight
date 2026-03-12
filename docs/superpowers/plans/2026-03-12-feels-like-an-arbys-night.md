# FeelsLikeAnArbysNight Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page Next.js app that finds nearby Arby's restaurants using the browser's geolocation and Google Places API, displayed on a Google Map with a Seinfeld David Puddy theme.

**Architecture:** Client-side Next.js page with Google Maps rendering. Server-side API route proxies Google Places API requests. Design tokens via CSS custom properties integrated into Tailwind for automatic dark/light theming.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, ShadCN UI, @vis.gl/react-google-maps, next-themes, Docker, Vercel

**Spec:** `docs/superpowers/specs/2026-03-12-feels-like-an-arbys-night-design.md`

---

## Chunk 1: Project Scaffolding & Infrastructure

### Task 1: Scaffold Next.js Project

**Files:**
- Create: all scaffolded files from `create-next-app`
- Create: `.env.local.example`

- [ ] **Step 1: Create Next.js app in current directory**

Since we already have files in the repo (docs, public/puddy-audio.mp3, .gitignore), we need to scaffold into a temp directory and move files in.

```bash
cd /Users/stephenpurr/src/feelslikeanarbysnight
npx create-next-app@latest temp-scaffold --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack
```

- [ ] **Step 2: Move scaffolded files into project root**

```bash
# Move all scaffolded files (except .git) into project root
cp -r temp-scaffold/* .
cp temp-scaffold/.eslintrc.json . 2>/dev/null || true
cp temp-scaffold/.gitignore.scaffold . 2>/dev/null || true
cp -r temp-scaffold/.next . 2>/dev/null || true
# Merge package.json, tsconfig, etc — they won't conflict since root is empty
rm -rf temp-scaffold
```

- [ ] **Step 3: Create .env.local.example**

```bash
# .env.local.example
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_javascript_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id
```

Note: A Map ID is required for AdvancedMarkerElement. Create one in the Google Cloud Console under Maps > Map Management.

- [ ] **Step 4: Create .env.local from example (for local dev)**

```bash
cp .env.local.example .env.local
# Edit .env.local with your actual API keys
```

- [ ] **Step 5: Verify the app runs**

```bash
npm run dev
```

Expected: Next.js dev server starts on http://localhost:3000, default page renders.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with TypeScript, Tailwind, App Router"
```

---

### Task 2: Set Up ShadCN UI

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/` (directory)

- [ ] **Step 1: Initialize ShadCN**

```bash
npx shadcn@latest init
```

When prompted, accept defaults. This creates `components.json` and `src/lib/utils.ts`.

- [ ] **Step 2: Install required ShadCN components**

```bash
npx shadcn@latest add card button dropdown-menu switch
```

- [ ] **Step 3: Install next-themes for dark mode**

```bash
npm install next-themes
```

- [ ] **Step 4: Install Google Maps library**

```bash
npm install @vis.gl/react-google-maps
```

- [ ] **Step 5: Install Bebas Neue font**

The font is available via `@fontsource/bebas-neue`:

```bash
npm install @fontsource/bebas-neue
```

- [ ] **Step 6: Verify build still works**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add ShadCN UI, next-themes, Google Maps library, Bebas Neue font"
```

---

### Task 3: Docker Setup

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Modify: `.gitignore` — add Docker-related entries

- [ ] **Step 1: Create Dockerfile**

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Development stage
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

- [ ] **Step 2: Create docker-compose.yml**

```yaml
# docker-compose.yml
services:
  app:
    build:
      context: .
      target: dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    env_file:
      - .env.local
    environment:
      - WATCHPACK_POLLING=true
```

- [ ] **Step 3: Update .gitignore**

Append to existing `.gitignore`:

```
# Dependencies
node_modules/

# Next.js
.next/
out/

# Environment
.env.local

# Docker
.docker/
```

- [ ] **Step 4: Test Docker Compose**

```bash
docker compose up --build
```

Expected: App starts and is accessible at http://localhost:3000.

```bash
docker compose down
```

- [ ] **Step 5: Commit**

```bash
git add Dockerfile docker-compose.yml .gitignore
git commit -m "feat: add Docker and Docker Compose for local development"
```

---

## Chunk 2: Design Tokens, Theming & Layout Shell

### Task 4: Design Tokens & Tailwind Integration

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/app/globals.css` — import tokens
- Modify: `tailwind.config.ts` — extend colors with CSS variables

- [ ] **Step 1: Create design tokens CSS file**

```css
/* src/styles/tokens.css */

/* Light mode (default) */
:root {
  --background: #faf9f7;
  --surface: #ffffff;
  --surface-elevated: #f5f4f2;
  --border: #e0ddd8;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --accent-red: #c41e3a;
  --accent-red-dark: #8b0000;
  --accent-warm: #b8784f;
  --user-location: #2563eb;
}

/* Dark mode */
.dark {
  --background: #0d0d0d;
  --surface: #1a1a1a;
  --surface-elevated: #2a2a2a;
  --border: #333333;
  --text-primary: #ffffff;
  --text-secondary: #888888;
  --accent-red: #c41e3a;
  --accent-red-dark: #8b0000;
  --accent-warm: #d4956a;
  --user-location: #4a90d9;
}
```

- [ ] **Step 2: Update globals.css to import tokens**

Replace the contents of `src/app/globals.css` with:

```css
@import "tailwindcss";
@import "../styles/tokens.css";

body {
  background-color: var(--background);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

* {
  border-color: var(--border);
}
```

Note: Keep any existing Tailwind directives that `create-next-app` generated. The key thing is to import `tokens.css` and set up the body defaults.

- [ ] **Step 3: Update tailwind.config.ts**

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        border: "var(--border)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "accent-red": "var(--accent-red)",
        "accent-red-dark": "var(--accent-red-dark)",
        "accent-warm": "var(--accent-warm)",
        "user-location": "var(--user-location)",
      },
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 4: Verify tokens work**

Temporarily add to `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text-primary p-8">
      <h1 className="text-accent-red text-4xl">Token Test</h1>
      <p className="text-text-secondary">Secondary text</p>
      <div className="bg-surface-elevated p-4 rounded border border-border mt-4">
        Surface elevated card
      </div>
    </div>
  );
}
```

Run `npm run dev` and verify colors render correctly.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/app/globals.css tailwind.config.ts src/app/page.tsx
git commit -m "feat: add design tokens and integrate with Tailwind config"
```

---

### Task 5: Theme Provider & Toggle Component

**Files:**
- Create: `src/components/theme-provider.tsx`
- Create: `src/components/theme-toggle.tsx`
- Modify: `src/app/layout.tsx` — wrap with ThemeProvider, add fonts

- [ ] **Step 1: Create ThemeProvider component**

```tsx
// src/components/theme-provider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

- [ ] **Step 2: Create ThemeToggle component**

```tsx
// src/components/theme-toggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
        >
          <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-surface border-border"
      >
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

- [ ] **Step 3: Install lucide-react if not already installed**

```bash
npm install lucide-react
```

(ShadCN may have already installed this — check package.json first.)

- [ ] **Step 4: Update root layout**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fontsource/bebas-neue";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Feels Like An Arby's Night",
  description: "Find your nearest Arby's. Yeah, that's right.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify theme toggle works**

Update `src/app/page.tsx` temporarily:

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text-primary p-8">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <h1 className="text-accent-red text-4xl font-display mt-4">
        FEELS LIKE AN ARBY&apos;S NIGHT
      </h1>
      <p className="text-text-secondary">Toggle dark/light mode above</p>
    </div>
  );
}
```

Run `npm run dev`. Verify:
- Theme toggle dropdown appears
- Switching themes changes background and text colors
- Bebas Neue renders for the title

- [ ] **Step 6: Commit**

```bash
git add src/components/theme-provider.tsx src/components/theme-toggle.tsx src/app/layout.tsx src/app/page.tsx
git commit -m "feat: add theme provider and dark/light mode toggle"
```

---

## Chunk 3: Puddy SVG & Audio

### Task 6: David Puddy SVG Component

**Files:**
- Create: `src/components/puddy-icon.tsx`

The SVG is a stylized caricature of David Puddy with NJ Devils face paint. This is a custom illustration — a simplified, bold vector face with the red/black Devils "D" pattern.

- [ ] **Step 1: Create PuddyIcon component**

```tsx
// src/components/puddy-icon.tsx
"use client";

import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

type PuddySize = "xs" | "sm" | "lg";

interface PuddyIconProps {
  size?: PuddySize;
  className?: string;
  playAudio?: boolean;
}

const sizeMap: Record<PuddySize, { width: number; height: number }> = {
  xs: { width: 32, height: 32 },
  sm: { width: 40, height: 40 },
  lg: { width: 120, height: 120 },
};

export function PuddyIcon({
  size = "lg",
  className,
  playAudio = false,
}: PuddyIconProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { width, height } = sizeMap[size];

  const handleClick = useCallback(() => {
    if (!playAudio) return;

    if (!audioRef.current) {
      audioRef.current = new Audio("/puddy-audio.mp3");
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play();
  }, [playAudio]);

  const svgContent = (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="David Puddy with Devils face paint"
    >
      {/* Face base */}
      <circle cx="60" cy="60" r="52" fill="#e8c39e" />

      {/* Devils face paint - red base */}
      <path
        d="M60 8 C60 8, 20 30, 20 60 C20 75, 30 90, 40 95 L60 70 L80 95 C90 90, 100 75, 100 60 C100 30, 60 8, 60 8Z"
        fill="#c41e3a"
        opacity="0.9"
      />

      {/* Devils face paint - black accents */}
      <path
        d="M60 15 C60 15, 35 35, 35 55 L60 45 L85 55 C85 35, 60 15, 60 15Z"
        fill="#1a1a1a"
      />

      {/* Eyes - white sclera */}
      <ellipse cx="42" cy="55" rx="10" ry="8" fill="white" />
      <ellipse cx="78" cy="55" rx="10" ry="8" fill="white" />

      {/* Eyes - dark irises (Puddy's intense stare) */}
      <circle cx="42" cy="55" r="5" fill="#2c1810" />
      <circle cx="78" cy="55" r="5" fill="#2c1810" />

      {/* Eye highlights */}
      <circle cx="44" cy="53" r="2" fill="white" opacity="0.8" />
      <circle cx="80" cy="53" r="2" fill="white" opacity="0.8" />

      {/* Thick eyebrows */}
      <path
        d="M28 45 Q35 38, 52 43"
        stroke="#1a1a1a"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M92 45 Q85 38, 68 43"
        stroke="#1a1a1a"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Nose */}
      <path
        d="M55 58 Q60 72, 65 58"
        stroke="#c4956e"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Mouth - deadpan expression */}
      <path
        d="M42 80 Q60 84, 78 80"
        stroke="#8b4513"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Chin dimple */}
      <path
        d="M57 92 Q60 95, 63 92"
        stroke="#c4956e"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Hair - slicked back dark hair */}
      <path
        d="M15 45 Q10 25, 30 12 Q45 4, 60 6 Q75 4, 90 12 Q110 25, 105 45"
        fill="#1a1a1a"
      />
      <path
        d="M15 45 Q12 35, 22 20 Q35 8, 60 8 Q85 8, 98 20 Q108 35, 105 45"
        fill="#2c2c2c"
      />
    </svg>
  );

  if (playAudio) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "rounded-full cursor-pointer transition-transform duration-200",
          "hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 focus:ring-offset-background",
          size === "lg" && "animate-puddy-glow",
          className
        )}
        role="button"
        aria-label="Play audio clip: Feels like an Arby's night"
      >
        {svgContent}
      </button>
    );
  }

  return <div className={className}>{svgContent}</div>;
}
```

- [ ] **Step 2: Add puddy-glow animation to Tailwind config**

Add to `tailwind.config.ts` under `theme.extend`:

```ts
keyframes: {
  "puddy-glow": {
    "0%, 100%": {
      filter: "drop-shadow(0 0 8px rgba(196, 30, 58, 0.3))",
    },
    "50%": {
      filter: "drop-shadow(0 0 20px rgba(196, 30, 58, 0.6))",
    },
  },
},
animation: {
  "puddy-glow": "puddy-glow 3s ease-in-out infinite",
},
```

- [ ] **Step 3: Verify the component renders**

Temporarily update `src/app/page.tsx`:

```tsx
import { ThemeToggle } from "@/components/theme-toggle";
import { PuddyIcon } from "@/components/puddy-icon";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text-primary p-8">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center gap-8 mt-8">
        <PuddyIcon size="lg" playAudio />
        <PuddyIcon size="sm" />
        <PuddyIcon size="xs" />
      </div>
    </div>
  );
}
```

Run `npm run dev`. Verify:
- All three sizes render
- Large icon has pulsing red glow
- Clicking large icon plays the audio clip
- Hover/click animations work

- [ ] **Step 4: Commit**

```bash
git add src/components/puddy-icon.tsx tailwind.config.ts src/app/page.tsx
git commit -m "feat: add David Puddy SVG component with face paint and audio playback"
```

---

## Chunk 4: API Route & Google Places Integration

### Task 7: Google Places API Route

**Files:**
- Create: `src/app/api/nearby-arbys/route.ts`
- Create: `src/lib/google-places.ts`
- Create: `src/lib/rate-limit.ts`

- [ ] **Step 1: Create rate limiter utility**

```ts
// src/lib/rate-limit.ts

const rateMap = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60;

export function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}
```

- [ ] **Step 2: Create Google Places client**

```ts
// src/lib/google-places.ts

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

  // Use Text Search (New) — supports textQuery + locationBias for "Arby's near me"
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
```

Note: This uses the **Places API (New)** which uses `searchNearby` via REST. The `textQuery` field combined with `includedTypes` narrows results to Arby's restaurants specifically.

- [ ] **Step 3: Create the API route**

```ts
// src/app/api/nearby-arbys/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchNearbyArbys } from "@/lib/google-places";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const { allowed, remaining } = rateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a minute." },
      {
        status: 429,
        headers: { "X-RateLimit-Remaining": String(remaining) },
      }
    );
  }

  // Validate params
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
      {
        headers: { "X-RateLimit-Remaining": String(remaining) },
      }
    );
  } catch (error) {
    console.error("Error fetching nearby Arby's:", error);
    return NextResponse.json(
      { error: "Failed to fetch nearby Arby's locations." },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Test the API route manually**

Start the dev server with valid API keys in `.env.local`:

```bash
npm run dev
```

Then test with curl:

```bash
curl "http://localhost:3000/api/nearby-arbys?lat=40.7128&lng=-74.0060"
```

Expected: JSON response with `{ locations: [...] }` containing nearby Arby's.

Also test error cases:

```bash
# Missing params
curl "http://localhost:3000/api/nearby-arbys"
# Expected: 400 error

# Invalid coords
curl "http://localhost:3000/api/nearby-arbys?lat=999&lng=0"
# Expected: 400 error
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/rate-limit.ts src/lib/google-places.ts src/app/api/nearby-arbys/route.ts
git commit -m "feat: add Places API route with rate limiting for nearby Arby's search"
```

---

## Chunk 5: Map Component & Location Components

### Task 8: ArbysMap Component

**Files:**
- Create: `src/components/arbys-map.tsx`

- [ ] **Step 1: Create the map component**

```tsx
// src/components/arbys-map.tsx
"use client";

import { useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { PuddyIcon } from "@/components/puddy-icon";
import type { ArbysLocation } from "@/lib/google-places";

interface ArbysMapProps {
  locations: ArbysLocation[];
  userLocation: { lat: number; lng: number } | null;
  isLoading: boolean;
}

function ArbysMarker({
  location,
}: {
  location: ArbysLocation;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [showInfo, setShowInfo] = useState(false);

  const handleClick = useCallback(() => {
    setShowInfo((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setShowInfo(false);
  }, []);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: location.lat, lng: location.lng }}
        onClick={handleClick}
        title={location.name}
      >
        <PuddyIcon size="sm" />
      </AdvancedMarker>

      {showInfo && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <div className="p-2 text-sm">
            <h3 className="font-semibold text-gray-900">{location.name}</h3>
            <p className="text-gray-600 text-xs mt-1">{location.address}</p>
            {location.openNow !== undefined && (
              <p
                className={`text-xs mt-1 font-medium ${
                  location.openNow ? "text-green-600" : "text-red-600"
                }`}
              >
                {location.openNow ? "Open now" : "Closed"}
              </p>
            )}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs mt-2 inline-block text-blue-600 hover:underline font-medium"
            >
              Get directions →
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function ArbysMap({
  locations,
  userLocation,
  isLoading,
}: ArbysMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "";

  const defaultCenter = userLocation ?? { lat: 39.8283, lng: -98.5795 };
  const defaultZoom = userLocation ? 12 : 4;

  return (
    <div className="w-full rounded-lg overflow-hidden border border-border">
      {/* Map header */}
      <div className="flex justify-between items-center px-4 py-2 bg-surface-elevated border-b border-border">
        <span className="font-semibold text-text-primary text-sm">
          Nearby Arby&apos;s
        </span>
        <span className="text-text-secondary text-xs">
          {isLoading
            ? "Searching..."
            : `${locations.length} location${locations.length !== 1 ? "s" : ""} found`}
        </span>
      </div>

      {/* Map */}
      <div className="h-[400px] md:h-[500px]">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
            mapId={mapId}
            gestureHandling="greedy"
            disableDefaultUI={false}
            {/* Dark/light map styling is handled via Cloud-based Map Styling
                using the Map ID configured in Google Cloud Console.
                Create two map styles (dark + light) and swap mapId based on theme if desired. */}
          >
            {/* User location marker */}
            {userLocation && (
              <AdvancedMarker position={userLocation}>
                <div className="w-4 h-4 bg-user-location rounded-full border-2 border-white shadow-lg shadow-user-location/50" />
              </AdvancedMarker>
            )}

            {/* Arby's markers */}
            {locations.map((location) => (
              <ArbysMarker key={location.id} location={location} />
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/arbys-map.tsx
git commit -m "feat: add ArbysMap component with custom Puddy markers and InfoWindows"
```

---

### Task 9: LocationCard & LocationList Components

**Files:**
- Create: `src/components/location-card.tsx`
- Create: `src/components/location-list.tsx`

- [ ] **Step 1: Create LocationCard component**

```tsx
// src/components/location-card.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ArbysLocation } from "@/lib/google-places";

interface LocationCardProps {
  location: ArbysLocation;
  userLocation: { lat: number; lng: number } | null;
  index: number;
}

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function LocationCard({
  location,
  userLocation,
  index,
}: LocationCardProps) {
  const distance = userLocation
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        location.lat,
        location.lng
      )
    : null;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;

  return (
    <Card
      className="bg-surface border-border hover:bg-surface-elevated transition-colors duration-200"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "both",
      }}
    >
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-semibold text-text-primary text-sm">
            {location.name}
          </h3>
          <p className="text-text-secondary text-xs mt-1">
            {distance !== null && (
              <span>{distance.toFixed(1)} mi · </span>
            )}
            {location.openNow !== undefined && (
              <span
                className={
                  location.openNow ? "text-green-500" : "text-red-500"
                }
              >
                {location.openNow ? "Open" : "Closed"}
              </span>
            )}
          </p>
          {location.hours && location.hours.length > 0 && (
            <p className="text-text-secondary text-xs mt-0.5 truncate max-w-[250px]">
              {location.hours[new Date().getDay()]}
            </p>
          )}
          {location.address && (
            <p className="text-text-secondary text-xs mt-0.5 truncate max-w-[250px]">
              {location.address}
            </p>
          )}
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-red text-sm font-semibold hover:text-accent-red-dark transition-colors whitespace-nowrap ml-4"
        >
          Directions →
        </a>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Create LocationList component**

```tsx
// src/components/location-list.tsx
"use client";

import { LocationCard } from "@/components/location-card";
import type { ArbysLocation } from "@/lib/google-places";

interface LocationListProps {
  locations: ArbysLocation[];
  userLocation: { lat: number; lng: number } | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-surface border border-border rounded-lg p-4 animate-pulse"
        >
          <div className="h-4 bg-surface-elevated rounded w-1/3 mb-2" />
          <div className="h-3 bg-surface-elevated rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function LocationList({
  locations,
  userLocation,
  isLoading,
  error,
  onRetry,
}: LocationListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-accent-red text-white rounded-lg hover:bg-accent-red-dark transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary">
          No Arby&apos;s found nearby. Puddy would not be pleased.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {locations.map((location, index) => (
        <LocationCard
          key={location.id}
          location={location}
          userLocation={userLocation}
          index={index}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/location-card.tsx src/components/location-list.tsx
git commit -m "feat: add LocationCard and LocationList components with distance calculation"
```

---

### Task 9b: LocationPermission Component

**Files:**
- Create: `src/components/location-permission.tsx`

- [ ] **Step 1: Create LocationPermission component**

```tsx
// src/components/location-permission.tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/location-permission.tsx
git commit -m "feat: add LocationPermission component for geolocation error state"
```

---

## Chunk 6: Main Page Assembly & Animations

### Task 10: Assemble the Main Page

**Files:**
- Modify: `src/app/page.tsx` — final page assembly
- Create: `src/hooks/use-geolocation.ts`
- Create: `src/hooks/use-nearby-arbys.ts`

- [ ] **Step 1: Create geolocation hook**

```tsx
// src/hooks/use-geolocation.ts
"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        error: "Geolocation is not supported by your browser.",
        loading: false,
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
          message =
            "Location access denied. We need your location to find nearby Arby's.";
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
```

- [ ] **Step 2: Create nearby Arby's data hook**

```tsx
// src/hooks/use-nearby-arbys.ts
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
```

- [ ] **Step 3: Build the main page**

```tsx
// src/app/page.tsx
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
          <PuddyIcon size="xs" />
          <ThemeToggle />
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
```

- [ ] **Step 4: Verify the full page works**

Run `npm run dev`. Verify:
- Nav bar renders with Puddy xs icon and theme toggle
- Hero renders with Puddy lg icon and title
- Clicking Puddy plays the audio
- Browser requests geolocation
- If granted, map zooms in and shows Puddy markers + location cards
- If denied, friendly error message shows
- Theme toggle switches between dark/light
- Location cards show distance, open/closed status, and directions link

- [ ] **Step 5: Commit**

```bash
git add src/hooks/use-geolocation.ts src/hooks/use-nearby-arbys.ts src/app/page.tsx
git commit -m "feat: assemble main page with geolocation, map, and location cards"
```

---

### Task 11: Animations

**Files:**
- Modify: `tailwind.config.ts` — add animation keyframes
- Modify: `src/components/location-card.tsx` — add slide-up animation class
- Modify: `src/components/arbys-map.tsx` — add marker fade-in

- [ ] **Step 1: Add animation keyframes to Tailwind config**

Add to `tailwind.config.ts` under `theme.extend.keyframes` (alongside the existing `puddy-glow`):

```ts
"slide-up": {
  "0%": { opacity: "0", transform: "translateY(20px)" },
  "100%": { opacity: "1", transform: "translateY(0)" },
},
"fade-in-bounce": {
  "0%": { opacity: "0", transform: "scale(0.5)" },
  "60%": { opacity: "1", transform: "scale(1.1)" },
  "100%": { opacity: "1", transform: "scale(1)" },
},
```

And under `theme.extend.animation`:

```ts
"slide-up": "slide-up 0.4s ease-out",
"fade-in-bounce": "fade-in-bounce 0.5s ease-out",
```

- [ ] **Step 2: Apply slide-up to LocationCard**

In `src/components/location-card.tsx`, add the `animate-slide-up` class to the `<Card>`:

```tsx
<Card
  className="bg-surface border-border hover:bg-surface-elevated transition-colors duration-200 animate-slide-up"
  style={{
    animationDelay: `${index * 100}ms`,
    animationFillMode: "both",
  }}
>
```

- [ ] **Step 3: Apply fade-in-bounce to map markers**

In `src/components/arbys-map.tsx`, wrap the PuddyIcon in the ArbysMarker with animation:

```tsx
<AdvancedMarker
  ref={markerRef}
  position={{ lat: location.lat, lng: location.lng }}
  onClick={handleClick}
  title={location.name}
>
  <div className="animate-fade-in-bounce">
    <PuddyIcon size="sm" />
  </div>
</AdvancedMarker>
```

- [ ] **Step 4: Verify animations**

Run `npm run dev`. Verify:
- Location cards slide up with staggered delay
- Map markers bounce in when they appear
- Puddy hero icon pulses with glow

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts src/components/location-card.tsx src/components/arbys-map.tsx
git commit -m "feat: add slide-up, fade-in-bounce, and glow animations"
```

---

### Task 12: Final Polish & Build Verification

**Files:**
- Modify: `next.config.ts` — add standalone output for Docker production build

- [ ] **Step 1: Update next.config.ts for Docker production builds**

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

- [ ] **Step 2: Run full build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: No lint errors. Fix any that appear.

- [ ] **Step 4: Test Docker production build**

```bash
docker compose up --build
```

Verify the app works at http://localhost:3000 via Docker.

```bash
docker compose down
```

- [ ] **Step 5: Commit**

```bash
git add next.config.ts
git commit -m "feat: add standalone output config for Docker production builds"
```

- [ ] **Step 6: Final commit with any remaining changes**

```bash
git add -A
git status
# If there are any uncommitted changes:
git commit -m "chore: final polish and cleanup"
```
