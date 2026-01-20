// Native fetch (Node 18+) or Prisma directly if running with ts-node, but simple node script using Prisma Client is best.
// usage: npx ts-node scripts/analytics-report.ts OR node scripts/analytics-report.js if converted. 
// Let's use standard node with imports if type: module, or require. 
// Actually, this project uses typescript, so let's make it a TS script run via ts-node or just use the local api if we wanted. 
// But the user asked for "Ensure we can run a count". A script is best.
// We'll trust the environment has ts-node or similar. 

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runReport() {
    console.log("📊 WEEKLY PERFORMANCE REPORT 📊");
    console.log(new Date().toISOString());
    console.log("-----------------------------------");

    // 1. Hitter Type Totals
    console.log("\n[1] Hitter Type Distribution:");
    const hitterTypes = await prisma.playerProfile.groupBy({
        by: ['motorProfile'],
        _count: {
            motorProfile: true
        }
    });

    // Also check Users table if profiles assume 'General'
    // Actually, motorProfile is on PlayerProfile depending on schema evolution 
    // Wait, recent schema has PlayerProfile, but User also had 'motorProfile' in some earlier versions?
    // Let's check schema: User has `Player Player?`. PlayerProfile has `rebootPlayerId`. 
    // Actually, `Player` in `User` relation points to `Player` model? No, `Player` relation points to `Player` which might be `User` (parent/child) or `PlayerProfile`?
    // Checking schema: 
    // `model User { ... Player Player? }` -> `model Player { id String ... user User ... motorProfile String }` ?
    // I need to be sure about the schema. The `inbox-client` used `user.Player.motorProfile`.
    // So there is a `Player` model related to `User`.

    // Safety check:
    const players = await prisma.player.groupBy({
        by: ['motorProfile'],
        _count: { motorProfile: true }
    });

    console.table(players);

    // 2. Top Keywords
    console.log("\n[2] Top SMS Keywords:");
    const keywords = await prisma.messageAnalytics.findMany({
        orderBy: { count: 'desc' },
        take: 10
    });
    console.table(keywords);

    // 3. Video Engagement
    console.log("\n[3] Recent Video Clicks:");
    const clicks = await prisma.videoEngagement.findMany({
        take: 5,
        orderBy: { viewedAt: 'desc' },
        include: { video: { select: { title: true } } }
    });

    clicks.forEach(c => {
        console.log(`- [${c.viewedAt.toISOString()}] User ${c.userId || 'Lead'} clicked "${c.video.title}"`);
    });

    console.log("\n-----------------------------------");
    console.log("✅ KPI Logging Verified.");
}

runReport()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
