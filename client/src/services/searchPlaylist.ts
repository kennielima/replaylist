"use server"
import { cookies } from "next/headers";

const searchSpotifyPlaylist = async (q: string) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();
    const token = cookie.get('token')?.value;
    const encodedQuery = encodeURIComponent(q);

    const searchSpotifyPlaylist = await fetch(`${process.env.API_URL}/api/search?q=${encodedQuery}`, {
        method: "GET",
        headers: {
            cookie: cookieHeader,
            'Authorization': `Bearer ${token}`,
            'Cookies': `token=${token}`
        },
        credentials: "include"
    });

    if (!searchSpotifyPlaylist.ok) {
        return null;
    }

    const data = await searchSpotifyPlaylist.json();
    return data;
}

export default searchSpotifyPlaylist;
