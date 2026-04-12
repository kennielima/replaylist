┌─────────────────────────────────────────────────────────────────────────────────┐
│ REPLAYLIST SYSTEM ARCHITECTURE │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐ ┌─────────────────────────────────────────────────────┐
│ EXTERNAL APIs │ │ CLIENT (Next.js :3000) │
│ │ │ │
│ ┌────────────┐ │ │ ┌─────────────────────────────────────────────┐ │
│ │ Spotify │◄─┼────────┤ │ Pages (App Router) │ │
│ │ API │ │ │ │ / Home │ │
│ └────────────┘ │ │ │ /playlists/[id] Playlist detail │ │
│ │ │ │ /users/[id] User profile │ │
│ ┌────────────┐ │ │ │ /search Playlist search │ │
│ │ Google │ │ │ │ /spotify/callback OAuth callback │ │
│ │ OAuth │ │ │ └─────────────┬───────────────────────────────┘ │
│ └────────────┘ │ │ │ │
└──────────────────┘ │ ┌─────────────▼───────────────────────────────┐ │
▲ │ │ Server Components (services/) │ │
│ │ │ getMe • getMyPlaylists • getMySnapshots │ │
│ │ │ getAPlaylist • getSnapshots • searchPlaylist│ │
│ │ └─────────────┬───────────────────────────────┘ │
│ │ │ fetch + HTTP-only cookie │
│ └────────────────┼────────────────────────────────────┘
│ │
│ ┌────────────────▼────────────────────────────────────┐
│ │ SERVER (Express :4001) │
│ │ │
│ │ ┌───────────────────────────────────────────────┐ │
│ │ │ MIDDLEWARE CHAIN │ │
│ │ │ authenticate.ts ──► ensureSpotifyToken.ts │ │
│ │ │ (validate JWT) (refresh access token) │ │
│ │ └───────────────────────────────────────────────┘ │
│ │ │
│ │ ┌───────────┐ ┌──────────┐ ┌────────────────┐ │
│ │ │ ROUTES │ │CONTROLLERS│ │ SERVICES │ │
│ │ │ │ │ │ │ │ │
│ │ │/auth ├─►│auth ├─►│SpotifyAuth.ts │ │
│ OAuth/token ────►│ │/playlists ├─►│playlist ├─►│snapshot.ts │ │
│ reqs │ │/tracker ├─►│tracker ├─►│cache.ts │ │
│ │ │/snapshots ├─►│snapshot ├─►│ │ │
│ │ │/users ├─►│user │ │ │ │
│ │ │/search ├─►│search │ │ │ │
│ │ └───────────┘ └──────────┘ └───────┬────────┘ │
│ │ │ │
│ │ ┌─────────────────────────────────────┼──────────┐│
│ │ │ CRON JOB (node-cron) │ ││
│ │ │ Schedule: "0 0 \* \* \*" (daily midnight) ││
│ │ │ ─► Get isTracked=true playlists ││
│ │ │ ─► If daysSinceStart % 7 === 0 ││
│ │ │ ─► saveSnapshot() ││
│ │ └────────────────────────────────────────────────┘│
│ └──────────┬──────────────────┬──────────────────────┘
│ │ │
│ ┌──────────────▼───┐ ┌─────────▼──────────────┐
│ │ PostgreSQL :5432 │ │ Redis :6379 │
│ │ │ │ (512MB LRU) │
│ │ ┌────────────┐ │ │ │
│ │ │ User │ │ │ Cache Keys (24hr TTL):│
│ │ │ spotifyId │ │ │ featured-playlists │
│ │ │ tokens │ │ │ playlist:{id} │
│ │ └─────┬──────┘ │ │ playlist:{id}/ │
│ │ │ │ │ snapshot:{id} │
│ │ ┌─────▼──────┐ │ │ userplaylists:{id} │
│ │ │ Playlist │ │ │ usersnapshots:{id} │
│ │ │ isTracked │ │ │ user:{id} (1hr TTL) │
│ │ │ isFeatured │ │ │ │
│ │ └─────┬──────┘ │ └────────────────────────┘
│ │ │ │
│ │ ┌─────▼──────┐ │
│ │ │ Snapshot │ │
│ │ │ createdAt │ │
│ │ └─────┬──────┘ │
│ │ │ 1:N │
│ │ ┌─────▼──────┐ │
│ │ │SnapshotTrack│ │
│ │ │ rank │ │
│ │ └─────┬──────┘ │
│ │ │ N:1 │
│ │ ┌─────▼──────┐ │
│ │ │ Track │ │
│ │ │ spotifyId │ │
│ │ │ artists[] │ │
│ │ └────────────┘ │
│ └──────────────────┘
│
┌────────┴─────────┐
│ Spotify OAuth │
│ Google OAuth │
│ ─ Authorization│
│ Code + PKCE │
│ ─ JWT in │
│ HTTP-only │
│ cookie (24h) │
└──────────────────┘
