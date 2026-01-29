import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from './lib/prisma';
import playlistRoutes from "./routes/playlist.route";
import trackerRoutes from "./routes/tracker.route";
import snapshotRoutes from "./routes/snapshot.route";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import searchRoutes from "./routes/search.route";
import cookieParser from "cookie-parser";
import cronJob from "./services/cronjob";
import { BASE_URL, PORT } from "./lib/config";
import logger from "./lib/logger";

const app = express();
const port = PORT || 4001;
dotenv.config();

app.use(express.json());
app.use(cors({
    origin: BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(cookieParser())

app.use("/api/playlists", playlistRoutes);
app.use("/api/tracker", trackerRoutes);
app.use("/api/snapshots", snapshotRoutes);
app.use("/api/spotify", searchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);

cronJob.start();

async function main() { logger.info("Prisma Client initialized") }
main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        logger.error(e)
        await prisma.$disconnect()
    })

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
})