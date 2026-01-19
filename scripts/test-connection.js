const { PrismaClient } = require('@prisma/client');

// Use the pooler port (6543) for both since 5432 is blocked
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.POSTGRES_PRISMA_URL
        },
    },
});

async function main() {
    try {
        console.log("Attempting compatibility check via Port 6543...");
        await prisma.$connect();
        console.log("✅ SUCCESS: Authentication passed!");
        // Try a simple query
        const result = await prisma.$queryRaw`SELECT 1 as result`;
        console.log("Query result:", result);
    } catch (e) {
        console.error("❌ ERROR: Connection failed.");
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
