import path from "path";

function loadPrismaClientClass(): any {
    const candidates = [
        path.join(process.cwd(), "generated", "prisma"),
        path.join(process.cwd(), "node_modules", ".prisma", "client"),
    ];

    for (const p of candidates) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const mod = require(p);
            if (mod && (mod.PrismaClient || mod.default?.PrismaClient)) {
                return mod.PrismaClient || mod.default?.PrismaClient;
            }
        } catch { }
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require("@prisma/client");
        if (mod && (mod.PrismaClient || mod.default?.PrismaClient)) {
            return mod.PrismaClient || mod.default?.PrismaClient;
        }
    } catch { }
    throw new Error("Prisma client not found. Run `npx prisma generate` or install @prisma/client.");
}

const PrismaClientClass: any = loadPrismaClientClass();
const prisma = new PrismaClientClass();

export default prisma;
