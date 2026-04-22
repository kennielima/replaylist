# Replaylist

**Music in time.** Replaylist tracks Spotify playlists over time — capturing snapshots of playlist changes and visualizing how tracks move, rise, fall, and disappear.

## What it does

- **Track playlists** — Mark any Spotify playlist for tracking. Replaylist takes periodic snapshots automatically.
- **Snapshot history** — Browse point-in-time captures to see exactly what a playlist looked like on any given date.
- **Track movements** — See when tracks were added or removed and how their rankings shifted between snapshots.
- **Search & discover** — Find playlists to track from Spotify's catalog.
- **Featured playlists** — Explore curated playlists from Spotify's featured section.
- **Multi-auth** — Sign in with Spotify or Google.

## Stack

| Layer         | Technology                                                   |
| ------------- | ------------------------------------------------------------ |
| Frontend      | Next.js 15 (App Router), React 19, TypeScript, TailwindCSS 4 |
| State         | React Query (server state), Zustand (client state)           |
| UI            | Radix UI, Framer Motion, Lucide React                        |
| Backend       | Express 5, TypeScript                                        |
| Database      | PostgreSQL 15 + Prisma ORM                                   |
| Cache / Queue | Redis 7                                                      |
| Auth          | Spotify OAuth, Google OAuth, JWT (HTTP-only cookies)         |
| Jobs          | node-cron (automated snapshots)                              |
| Infra         | Docker, GitHub Actions → Hetzner                             |

## Getting started

### Prerequisites

- Docker + Docker Compose
- Spotify Developer app ([create one here](https://developer.spotify.com/dashboard))
- Google OAuth credentials (optional)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/replaylist.git
cd replaylist
```

### 2. Configure environment

**Server** — create `server/.env`:

```env
PORT=4001
BASE_URL=http://127.0.0.1:3000

# Database
DATABASE_URL=postgres://user:password@db:5432/replaylist
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=replaylist
DB_PORT=5432

# Redis
REDIS_URL=redis://redis:6379
REDIS_PORT=6379

# Spotify OAuth
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:4001/api/auth/spotify/callback
SPOTIFY_AUTH_URI=https://accounts.spotify.com/authorize
SPOTIFY_URL=https://api.spotify.com/v1
TOKEN_API=https://accounts.spotify.com/api/token

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://127.0.0.1:4001/api/auth/google/callback

# Security
JWT_SECRET=your_jwt_secret_here
SYS_ADMIN_EMAIL=admin@example.com

NODE_ENV=DEVELOPMENT
```

**Client** — create `client/.env.local`:

```env
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000
BASE_URL=http://127.0.0.1:3000
API_URL=http://server:4001
NEXT_PUBLIC_API_URL=http://server:4001

SPOTIFY_URL=https://open.spotify.com
NEXT_PUBLIC_SPOTIFY_URL=https://open.spotify.com
USER_URL=https://open.spotify.com/user
NEXT_PUBLIC_USER_URL=https://open.spotify.com/user

SYS_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_SYS_ADMIN_EMAIL=admin@example.com
```

### 3. Start with Docker

```bash
docker-compose up -d --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4001

Hot-reload is enabled by default via `docker-compose.override.yml` — file changes in `server/src` and `client/src` are synced automatically.

## Development (without Docker)

**Backend**

```bash
cd server
npm install
npm run prisma:generate
npm run dev          # :4001
```

**Frontend**

```bash
cd client
npm install
npm run dev          # :3000
```

## Project structure

```
replaylist/
├── client/                    # Next.js frontend
│   ├── src/app/
│   │   ├── (auth)/            # Login / OAuth callback pages
│   │   ├── playlists/[id]/    # Playlist detail + snapshot viewer
│   │   ├── search/            # Search playlists
│   │   ├── users/             # User profiles
│   │   └── page.tsx           # Homepage (featured playlists)
│   └── src/services/          # API client functions
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── routes/            # Route definitions
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic + cron jobs
│   │   ├── middleware/        # Auth + Spotify token refresh
│   │   └── lib/               # Utilities, Prisma client
│   └── prisma/
│       └── schema.prisma      # Database schema
│
├── docker-compose.yml         # Production config
├── docker-compose.override.yml# Dev hot-reload overrides
└── .github/workflows/
    └── deploy.yml             # CI/CD → Hetzner
```

## API overview

```
POST /api/auth/spotify/login        Initiate Spotify OAuth
GET  /api/auth/spotify/callback     Spotify OAuth callback
GET  /api/auth/google/login         Initiate Google OAuth
GET  /api/auth/spotify/logout       Logout

GET  /api/user/me                   Current user
GET  /api/user/me/playlists         User's Spotify playlists
GET  /api/user/me/snapshots         User's tracked snapshots
GET  /api/user/:id                  User by ID

GET  /api/playlist/get-featured     Featured playlists
GET  /api/playlist/:id              Playlist details

GET  /api/search?q=query            Search playlists

GET  /api/snapshot/:id/getSnapshots           All snapshots for a playlist
GET  /api/snapshot/:id/getSnapshots/:snapId   Specific snapshot

GET  /api/tracker/:id/startTracker  Start tracking a playlist
GET  /api/tracker/:id/stopTracker   Stop tracking a playlist
```

## Database schema

```
User
 └── Playlist (1:N)
      ├── Snapshot (1:N)
      │    └── SnapshotTrack (1:N) ← unique on [snapshotId, trackId]
      └── Track (1:N)
```

- **Playlist** — `isTracked` flag controls whether cron snapshots run for it
- **Snapshot** — immutable point-in-time record of a playlist's state
- **SnapshotTrack** — tracks a song's position/ranking within a snapshot
- **Track** — song metadata (name, artists, album, image)

## Deployment

Deployments are automated via GitHub Actions on every push to `main`.

```
Push to main
  → SSH into Hetzner server
  → git pull
  → docker-compose down
  → docker-compose up -d --build
```

**Required GitHub secrets:**

| Secret           | Description                   |
| ---------------- | ----------------------------- |
| `SERVER_HOST`    | Hetzner server IP or hostname |
| `SERVER_USER`    | SSH username                  |
| `SERVER_SSH_KEY` | SSH private key               |

## License

MIT
