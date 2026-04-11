import searchSpotifyPlaylist from '@/services/searchPlaylist';
import React from 'react'
import SearchResult from './components/SearchResult';
import fetchCurrentUser from '@/services/getMe';
import { Music } from 'lucide-react';


type Params = Promise<{
    q: string
}>

const page = async ({ searchParams }: { searchParams: Params }) => {
    const query = await searchParams;
    const searchData = await searchSpotifyPlaylist(query.q);
    const user = await fetchCurrentUser();

    if (!searchData || !searchData.data) {
        return (
            <div
                className="text-center py-12 items-center"
            >
                <Music className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                    No results found
                </h3>
            </div>
        )
    }

    return (
        <SearchResult searchData={searchData} query={query.q} />
    )
}

export default page