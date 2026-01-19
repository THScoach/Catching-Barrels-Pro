import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up database...');

    // 1. Delete existing ProModels (since we are redefining the schema and seeding fresh)
    // Note: ProModel might not exist in the client yet if generation failed, 
    // but we can try raw query or just skip if it fails.
    try {
        await prisma.$executeRawUnsafe('DELETE FROM "ProModel";');
        console.log('Deleted existing ProModels (Raw).');
    } catch (e) {
        console.log('ProModel table might not exist, skipping.');
    }

    try {
        const result = await prisma.$executeRawUnsafe('DELETE FROM "SwingVideo" WHERE "lessonId" IS NULL;');
        console.log(`Deleted orphan SwingVideos (Raw). Result:`, result);
    } catch (e) {
        console.log('Error deleting orphan swings:', e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
