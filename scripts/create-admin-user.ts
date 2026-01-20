
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'swingrehabcoach@gmail.com';
    const password = 'Barrels2026!';
    const name = 'Rick Strickland';
    const role = 'admin';

    console.log(`Initializing Admin User: ${email}`);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                role: role,
            },
            create: {
                email,
                name,
                password: hashedPassword,
                role: role,
                profileCompleted: true,
                firstLoginCompleted: true
            }
        });

        console.log(`✅ Success! Admin user '${user.email}' created/updated.`);
        console.log(`Role: ${user.role}`);
        console.log(`Password: ${password}`);

    } catch (e) {
        console.error("❌ Error creating admin user:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
