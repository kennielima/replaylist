import fetchAPlaylist from '@/services/getAPlaylist';
import React from 'react'
import PlaylistComponent from './components/PlaylistComponent';
import fetchCurrentUser from '@/services/getMe';
import fetchSpotifyPlaylist from '@/services/getSpotifyPlaylist';

type Params = Promise<{
    id: string
}>

const page = async ({ params }: { params: Params }) => {
    const { id } = await params;

    const playlistData = await fetchAPlaylist(id);
    const playlistsData = await fetchSpotifyPlaylist();
    const currUser = await fetchCurrentUser();

    if (!playlistData) {
        return <div>No playlist found</div>;
    }

    return (
        <PlaylistComponent
            playlistData={playlistData}
            playlistsData={playlistsData}
            currUser={currUser}
        />
    )
}

export default page