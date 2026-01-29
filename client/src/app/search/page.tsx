import searchSpotifyPlaylist from '@/services/searchPlaylist';
import React from 'react'
import SearchResult from './components/SearchResult';
import fetchCurrentUser from '@/services/getMe';


type Params = Promise<{
    q: string
}>

const page = async ({ searchParams }: { searchParams: Params }) => {
    const query = await searchParams;
    const searchData = await searchSpotifyPlaylist(query.q);
    const user = await fetchCurrentUser();

    if (!searchData || !searchData.data) {
        return <div>No results found</div>;
    }

    return (
        <SearchResult searchData={searchData} query={query.q} user={user} />
    )
}

export default page