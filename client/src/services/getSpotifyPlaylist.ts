"use server"
import { cookies } from "next/headers";

const fetchSpotifyPlaylist = async () => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();
    const token = cookie.get('token')?.value;
    // if (!token) {
    //     return null;
    // }

    const fetchSpotifyPlaylist = await fetch(`${process.env.API_URL}/api/playlists/get-featured`, {
        method: "GET",
        headers: {
            cookie: cookieHeader,
            'Authorization': `Bearer ${token}`,
            'Cookies': `token=${token}`
        },
        credentials: "include"
    });

    if (!fetchSpotifyPlaylist.ok) {
        return null;
    }

    const { data } = await fetchSpotifyPlaylist.json();
    return data;
}

export default fetchSpotifyPlaylist;