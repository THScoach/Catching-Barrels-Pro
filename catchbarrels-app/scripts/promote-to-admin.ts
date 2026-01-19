import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'player@test.com';
    console.log(`Promoting ${email} to admin...`);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: 'admin' },
        });
        console.log('✅ Success! User updated:', user);
    } catch (error) {
        console.error('❌ Error updating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
