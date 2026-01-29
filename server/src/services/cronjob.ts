import cron from 'node-cron';
import prisma from '../lib/prisma';
import { getSpotifyToken } from './SpotifyAuth';
import { saveSnapshot } from './snapshot';
import logger from '../lib/logger';

const cronJob = cron.schedule('0 0 * * *', async () => {
    const { access_token } = await getSpotifyToken();
    const now = new Date();

    const playlists = await prisma.playlist.findMany({
        where: {
            isTracked: true,
            trackingStartDate: { not: null }
        }
    });

    for (let playlist of playlists) {
        const trackingStartDate = new Date(playlist.trackingStartDate!);
        const daysSinceStart = Math.floor((now.getTime() - trackingStartDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceStart > 0 && daysSinceStart % 7 === 0) {
            const tracker = playlist.isTrackedBy || '';
            try {
                const snapshot = await saveSnapshot(playlist.playlistId, tracker, access_token, null);
            } catch (err) {
                logger.error(`Error tracking ${playlist.id}:`, err);
            }
        }
    }
});
export default cronJob;