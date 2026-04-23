import { Button } from '@/components/ui/button';
import { User } from '@/lib/types'
import { getInitials } from '@/lib/utils';
import { Headphones, Play } from 'lucide-react'
import Link from 'next/link';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import HeaderSearch from './HeaderSearch';

const HeaderComponent = ({ user }: { user: User }) => {
    return (
        <header className='sticky top-0 z-10 w-full h-24 flex items-center justify-between px-6 md:px-12 lg:px-22 bg-[#111009]/90 backdrop-blur-md border-b border-white/5'>
            <Link href='/' className='flex items-center space-x-3 shrink-0'>
                <div className="relative p-2 bg-purple-600/20 rounded-lg border border-purple-400/30">
                    <Headphones className="h-9 w-9 text-purple-300" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                </div>
                <span className="text-2xl font-bold text-purple-300 hidden sm:inline">Replaylist</span>
            </Link>
            <div className='flex items-center gap-3 sm:gap-6'>
                <HeaderSearch />
                <Link href='/about' className='text-slate-300 hover:text-purple-300 text-sm font-medium transition-colors'>
                    About
                </Link>
                {user &&
                    <Link href='/users/me'>
                        <Avatar className="h-12 w-12 bg-purple-400">
                            <AvatarImage src={user.userImage} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                    </Link>
                }
                {!user && (
                    <Link href='/login'>
                        <Button className='bg-purple-400 hover:bg-purple-300 text-black font-bold cursor-pointer' size={'sm'}>Login</Button>
                    </Link>
                )}
            </div>
        </header>
    )
}

export default HeaderComponent