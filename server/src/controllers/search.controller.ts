import { Response } from "express";
import { TokenRequest } from "../middlewares/ensureSpotifyToken";
import { SPOTIFY_URL } from "../lib/config";
import logger from "../lib/logger";
import { fetchPlaylistById } from "../services/playlists";
import { extractPlaylistId, getPlaylistMatchScore, normalizeSearchValue } from "../lib/utils";

type SpotifyPlaylist = {
    name?: string;
};

async function searchPlaylists(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    const query = (req.query.q as string | undefined)?.trim() ?? "";

    try {
        if (!accessToken) {
            return res.status(401).json({ error: "Spotify access token is not available" });
        }
        if (!query) {
            return res.status(400).json({ error: "A search query is required" });
        }

        const playlistId = extractPlaylistId(query);
        if (playlistId) {
            const result = await fetchPlaylistById(playlistId, accessToken);
            if (!result.valid) {
                return res.status(404).json({ error: "Playlist not found" });
            }
            return res.status(200).json({ data: [result.data] });
        }

        const responseData = await fetch(`${SPOTIFY_URL}/search?q=${encodeURIComponent(query)}&type=playlist&limit=50`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
        });
        if (!responseData.ok) {
            const errorBody = await responseData.text();
            return res.status(responseData.status).json({ error: errorBody });
        }
        const fetchedPlaylists = await responseData.json();
        if (fetchedPlaylists.error) {
            return res.status(500).json({ error: "Error searching playlists from Spotify", details: fetchedPlaylists.error });
        }
        const normalizedQuery = normalizeSearchValue(query);
        const playlists = (fetchedPlaylists.playlists.items ?? [])
            .filter(Boolean)
            .sort((a: SpotifyPlaylist, b: SpotifyPlaylist) => {
                const scoreDifference = getPlaylistMatchScore(a, normalizedQuery) - getPlaylistMatchScore(b, normalizedQuery);

                if (scoreDifference !== 0) {
                    return scoreDifference;
                }

                return (a.name ?? "").localeCompare(b.name ?? "");
            });

        return res.status(200).json({ data: playlists });

    } catch (error) {
        logger.error("Error searching:", error);
        return res.status(500).json({ error: "Internal server error while searching" });
    }
}

export { searchPlaylists };
