"use client"
import SearchByQuery from '@/components/SearchByQuery'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Playlist, User } from '@/lib/types'
import { containerVariants, itemVariants } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Info, Music, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

type SearchTypeProps = {
    searchData: { data: Playlist[] },
    query: string,
}

const SearchResult = ({ searchData, query }: SearchTypeProps) => {
    const playlists = searchData.data;
    const getTrackCount = (playlist: Playlist) => playlist.trackCount ?? playlist.tracks?.total ?? 0;
    const [showNote, setShowNote] = useState(false);

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='flex items-center justify-center mb-4'>
                <SearchByQuery category="playlist" />
            </div>
            <div className="flex flex-col items-center justify-center mb-6">
                <p className="text-center text-sm text-slate-400">
                    Can&apos;t find what you&apos;re looking for? Paste Spotify playlist link for an exact match.
                </p>
                {/* <div
                    className="relative"
                    onMouseEnter={() => setShowNote(true)}
                    onMouseLeave={() => setShowNote(false)}
                >
                    <Info className="h-3.5 w-3.5 text-yellow-400 cursor-pointer" />
                    {showNote && (
                        <div className="absolute bottom-full right-0 mb-2 w-56 max-w-[calc(100vw-2rem)] rounded-md bg-slate-800 border border-white/10 px-3 py-2 text-xs text-slate-300 shadow-lg z-10">
                            Spotify-owned playlists (e.g. editorial charts) are not supported by the Spotify API and cannot be searched or tracked.
                            <div className="absolute top-full right-1 border-4 border-transparent border-t-slate-800" />
                        </div>
                    )}
                </div> */}
                <p className="text-center text-xs text-slate-500">
                    Spotify-owned playlists (e.g. editorial charts) are not supported by the API and cannot be searched or tracked.
                </p>
            </div>
            <h2 className='my-8 text-lg'>Showing <b>{playlists.length}</b> result(s) for &apos;<u>{query}</u>&apos;</h2>
            {/* Playlists Grid */}
            <motion.div
                className={"grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {playlists.map((playlist: Playlist) => (
                    <motion.div
                        key={playlist.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link href={`/playlists/${playlist.playlistId || playlist.id}`}>
                            <Card className="group h-full cursor-pointer overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-300">
                                <CardContent className="flex h-full flex-col p-0">
                                    <div className="relative overflow-hidden rounded-t-lg">
                                        <Image
                                            height={300}
                                            width={300}
                                            src={playlist.images?.[0].url || "/icon.png"}
                                            alt={playlist.name}
                                            className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                            <Button
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-purple-400 hover:bg-purple-300 text-black shadow-lg h-11 w-11"
                                            >
                                                <Play className="h-5 w-5" />
                                            </Button>
                                        </div>

                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="space-y-3">
                                            <h3 className="min-h-14 text-lg font-semibold text-white line-clamp-2">
                                                {playlist.name}
                                            </h3>
                                            <p className="min-h-[4.5rem] text-sm leading-6 text-slate-300 line-clamp-3">
                                                {playlist.description?.replace(/<[^>]+>/g, "") || "No description provided."}
                                            </p>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                                            <span className="inline-flex items-center gap-2 text-slate-300">
                                                <Music className="h-4 w-4 text-purple-300" />
                                                Playlist
                                            </span>
                                            <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-slate-200">
                                                {getTrackCount(playlist)} tracks
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* Empty State */}
            {playlists.length === 0 && (
                <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Music className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                        No playlists found
                    </h3>
                </motion.div>
            )}
        </div>
    )
}

export default SearchResult
