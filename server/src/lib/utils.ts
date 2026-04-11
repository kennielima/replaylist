export const generateRandomString = (length: number): string => {
    return Math.random().toString(36).substring(2, 15);
}

// Matches a raw Spotify playlist ID (Base62, 22 chars) or a full Spotify URL
const SPOTIFY_ID_REGEX = /^[A-Za-z0-9]{22}$/;
const SPOTIFY_URL_REGEX = /open\.spotify\.com\/playlist\/([A-Za-z0-9]{22})/;

export function extractPlaylistId(query: string): string | null {
    const urlMatch = query.match(SPOTIFY_URL_REGEX);
    if (urlMatch) return urlMatch[1];
    if (SPOTIFY_ID_REGEX.test(query)) return query;
    return null;
}

type SpotifyPlaylist = {
    name?: string;
};

export function normalizeSearchValue(value: string) {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

export function getPlaylistMatchScore(playlist: SpotifyPlaylist, normalizedQuery: string) {
    const normalizedName = normalizeSearchValue(playlist.name ?? "");

    if (!normalizedName) { return 3 }

    if (normalizedName === normalizedQuery) { return 0 }

    if (normalizedName.startsWith(normalizedQuery)) { return 1 }

    if (normalizedName.includes(normalizedQuery)) { return 2 }

    return 3;
}